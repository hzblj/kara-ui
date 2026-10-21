import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {type ConfigPlugin, IOSConfig, withDangerousMod} from 'expo/config-plugins'

/**
 * Our own values for one UIKit semantic colour. `light` and `dark` are required — a colour set without both
 * would leave one appearance to fall through to Apple's value, which is the confusing half-override.
 */
export type IosColorAppearances = {
  dark: string
  /** Used instead of `dark` when the user has asked for increased contrast. */
  highContrastDark?: string
  /** Used instead of `light` when the user has asked for increased contrast. */
  highContrastLight?: string
  light: string
}

export type IosSemanticColorsProps = {
  /**
   * The overrides, keyed by UIKit semantic name. Wins over anything in `file` for the same key, so a designer
   * can hand over a JSON and the config can still pin one colour.
   */
  colors?: Record<string, IosColorAppearances>
  /** Path to a JSON file of the same shape, relative to the project root. */
  file?: string
}

/**
 * The names this plugin will write a colour set for. A value rather than a type because JSON is not type-checked — a
 * typo would otherwise produce an asset nobody asks for, and the override would silently not apply.
 *
 * Deliberately a copy of the theme's `IosSemanticColor` rather than an import of it: the plugin is compiled for Node on
 * its own, and the theme sits behind platform-split files that only Metro resolves. A name added there and not here
 * fails loudly at prebuild, listing what is known, rather than silently doing nothing.
 */
const OVERRIDABLE = [
  'blueColor',
  'clearColor',
  'darkTextColor',
  'labelColor',
  'lightTextColor',
  'linkColor',
  'opaqueSeparatorColor',
  'placeholderTextColor',
  'quaternaryLabelColor',
  'quaternarySystemFillColor',
  'secondaryLabelColor',
  'secondarySystemBackgroundColor',
  'secondarySystemFillColor',
  'secondarySystemGroupedBackgroundColor',
  'separatorColor',
  'systemBackgroundColor',
  'systemBlueColor',
  'systemBrownColor',
  'systemCyanColor',
  'systemFillColor',
  'systemGray2Color',
  'systemGray3Color',
  'systemGray4Color',
  'systemGray5Color',
  'systemGray6Color',
  'systemGrayColor',
  'systemGreenColor',
  'systemGroupedBackgroundColor',
  'systemIndigoColor',
  'systemMintColor',
  'systemOrangeColor',
  'systemPinkColor',
  'systemPurpleColor',
  'systemRedColor',
  'systemTealColor',
  'systemYellowColor',
  'tertiaryLabelColor',
  'tertiarySystemBackgroundColor',
  'tertiarySystemFillColor',
  'tertiarySystemGroupedBackgroundColor',
] as const

/** Stamped into every set we write, so a later run can tell ours from one a designer added by hand. */
const AUTHOR = '@hzblj/kara-ui'

const COLORSET_SUFFIX = '.colorset'

type Components = {alpha: string; blue: string; green: string; red: string}

const HEX_SHORT = 4
const HEX_RGB = 7
const HEX_RGBA = 9
const ALPHA_MAX = 255

const byte = (hex: string): string => `0x${hex.toUpperCase()}`

/**
 * Accepts `#rgb`, `#rrggbb` and `#rrggbbaa` — the forms the palette itself is written in, alpha last, CSS order.
 * The asset catalog wants the channels as `0xNN` and the alpha as a decimal fraction, hence the split.
 */
const components = (name: string, appearance: string, hex: string): Components => {
  const value = hex.trim()

  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    throw new Error(`[ios-semantic-colors] "${name}.${appearance}" is "${hex}" — expected #rgb, #rrggbb or #rrggbbaa.`)
  }

  const digits =
    value.length === HEX_SHORT ? [...value.slice(1)].map(digit => `${digit}${digit}`).join('') : value.slice(1, HEX_RGB)

  const alpha = value.length === HEX_RGBA ? Number.parseInt(value.slice(HEX_RGB), 16) / ALPHA_MAX : 1

  return {
    alpha: alpha.toFixed(3),
    blue: byte(digits.slice(4, 6)),
    green: byte(digits.slice(2, 4)),
    red: byte(digits.slice(0, 2)),
  }
}

const entry = (appearances: {appearance: string; value: string}[], components: Components) => ({
  ...(appearances.length > 0 ? {appearances} : {}),
  color: {'color-space': 'srgb', components},
  idiom: 'universal',
})

/**
 * Builds one colour set's `Contents.json`. Exported so the mapping can be exercised without a prebuild.
 *
 * A colour set carries one entry per appearance combination it answers. The plain entry is the fallback UIKit uses
 * when nothing more specific matches, so light lives there rather than under `luminosity: light`.
 */
export const iosColorSet = (name: string, appearances: IosColorAppearances) => {
  const colors = [
    entry([], components(name, 'light', appearances.light)),
    entry([{appearance: 'luminosity', value: 'dark'}], components(name, 'dark', appearances.dark)),
  ]

  if (appearances.highContrastLight) {
    colors.push(
      entry(
        [{appearance: 'contrast', value: 'high'}],
        components(name, 'highContrastLight', appearances.highContrastLight)
      )
    )
  }

  if (appearances.highContrastDark) {
    colors.push(
      entry(
        [
          {appearance: 'contrast', value: 'high'},
          {appearance: 'luminosity', value: 'dark'},
        ],
        components(name, 'highContrastDark', appearances.highContrastDark)
      )
    )
  }

  return `${JSON.stringify({colors, info: {author: AUTHOR, version: 1}}, null, 2)}\n`
}

const readJsonColors = async (projectRoot: string, file: string): Promise<Record<string, IosColorAppearances>> => {
  const filePath = path.resolve(projectRoot, file)

  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  } catch (cause) {
    throw new Error(`[ios-semantic-colors] Could not read "${filePath}".`, {cause})
  }
}

export const assertOverridable = (names: string[]): void => {
  const unknown = names.filter(name => !OVERRIDABLE.some(allowed => allowed === name))

  if (unknown.length > 0) {
    throw new Error(
      `[ios-semantic-colors] Not UIKit semantic colours: ${unknown.join(', ')}. ` +
        `A name must carry its Objective-C \`Color\` suffix — \`labelColor\`, not \`label\`. ` +
        `Known: ${OVERRIDABLE.join(', ')}.`
    )
  }
}

/**
 * Removes sets this plugin wrote on an earlier run that are no longer configured. Only ours are touched — the
 * author stamp is what keeps a hand-authored set safe — and a stale one matters because a colour left in the
 * catalog keeps overriding long after it was deleted from the config.
 */
const removeOrphans = async (catalog: string, keep: Set<string>): Promise<void> => {
  const dirents = await readdir(catalog, {withFileTypes: true}).catch(() => [])

  for (const dirent of dirents) {
    if (!dirent.isDirectory() || !dirent.name.endsWith(COLORSET_SUFFIX)) {
      continue
    }

    const name = dirent.name.slice(0, -COLORSET_SUFFIX.length)

    if (keep.has(name)) {
      continue
    }

    const setPath = path.join(catalog, dirent.name)
    const existing = await readFile(path.join(setPath, 'Contents.json'), 'utf8').catch(() => '')

    if (existing.includes(`"author": "${AUTHOR}"`)) {
      await rm(setPath, {force: true, recursive: true})
    }
  }
}

/**
 * Redefines what a UIKit semantic colour resolves to, app-wide, by writing a colour set of that exact name into
 * the generated asset catalog. Both bridges look a semantic name up with `UIColor(named:)` *before* falling back
 * to the platform's own colour, so an asset of that name wins — which is what makes this an override rather than
 * one more token.
 *
 * Two things it does not do, and both matter:
 *
 * - It reaches only code that resolves colours *by name*, which means our own tokens. UIKit asking itself for
 *   `UIColor.label` is a class property, not a lookup, so system chrome is unlikely to follow. Verify on device
 *   before relying on it.
 * - It has no Android counterpart. Material roles are computed from the wallpaper, `materialSeed` or the M3
 *   baseline, none of which an app can reach into — so anything overridden here needs `adaptive(...)` in the
 *   palette to match on the other platform.
 *
 * Prefer `adaptive({light, dark})` in the palette for a single colour. This earns its keep when one semantic
 * backs many tokens and you want all of them moved by one edit.
 */
export const withIosSemanticColors: ConfigPlugin<IosSemanticColorsProps> = (config, {colors = {}, file} = {}) =>
  withDangerousMod(config, [
    'ios',
    async config => {
      const fromFile = file ? await readJsonColors(config.modRequest.projectRoot, file) : {}
      const merged: Record<string, IosColorAppearances> = {...fromFile, ...colors}
      const names = Object.keys(merged)

      assertOverridable(names)

      // Everything is generated — and therefore validated — before anything is written, so a bad hex late in the
      // map cannot leave the catalog holding half an override.
      const sets = names.map(name => [name, iosColorSet(name, merged[name])] as const)
      const catalog = path.join(IOSConfig.Paths.getSourceRoot(config.modRequest.projectRoot), 'Images.xcassets')

      for (const [name, contents] of sets) {
        const setPath = path.join(catalog, `${name}${COLORSET_SUFFIX}`)

        await mkdir(setPath, {recursive: true})
        await writeFile(path.join(setPath, 'Contents.json'), contents, 'utf8')
      }

      // Sets from an earlier run that are no longer configured, so a deleted override stops overriding.
      await removeOrphans(catalog, new Set(names))

      return config
    },
  ])
