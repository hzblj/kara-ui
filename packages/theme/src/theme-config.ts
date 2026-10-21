import type {DimmableColor, IosSemanticColorRef, PaletteColor} from './primitives/color-source'
import type {FontsConfig} from './primitives/typography'
import {type Palette, palette} from './themes/palette'

/**
 * What one colour may be overridden with. A token that can be dimmed (`fill.accent.base:o50`) keeps to the kinds that
 * stay dimmable — a hex, `adaptive(...)`, or `native({android, light, dark})` — because a UIKit semantic colour would
 * leave `:oNN` with no alpha channel to multiply on iOS. A token iOS already resolves by name takes any kind.
 */
type ColorOverride<TColor> = TColor extends IosSemanticColorRef ? PaletteColor : DimmableColor

/**
 * The palette's own shape with every colour optional: override one token, a group, or all of it. The token *names*
 * are fixed — an override changes what a name resolves to, never which names exist — so every call site, every `sx`
 * prop and every story keeps type-checking against the same set.
 */
export type PaletteOverrides<TGroup = Palette> = {
  [TKey in keyof TGroup]?: TGroup[TKey] extends PaletteColor
    ? ColorOverride<TGroup[TKey]>
    : PaletteOverrides<TGroup[TKey]>
}

export type ThemeConfig = {
  /** Colour overrides, merged over the default palette. Build them with `native`, `adaptive` or a hex. */
  colors?: PaletteOverrides
  /**
   * Material You, on Android: the Material scheme follows the device wallpaper (Android 12+), and the accent tokens take
   * Material's `primary` roles, so buttons, switches, links and FABs move with it — re-read when the app returns to the
   * foreground, so a new wallpaper lands without a restart. Below Android 12 the scheme grows from `materialSeed`. iOS
   * has no wallpaper colours and keeps the palette's accent; every `:oNN` token stays valid on both.
   */
  dynamicColor?: boolean
  /** The app's own typeface, by role and weight. Omitted, text is set in the platform's face. */
  fonts?: FontsConfig
  /**
   * The colour Android's Material 3 scheme is generated from — every `native({android})` role and every Compose
   * control grows from it. Defaults to the accent. `null` hands the scheme to the wallpaper but keeps the accent tokens
   * ours; `dynamicColor` hands the accent over too. Ignored while `dynamicColor` is on and the OS supports it.
   */
  materialSeed?: string | null
}

/** Identity at runtime; there so a theme declared in its own module is checked against `ThemeConfig` where it lives. */
export const defineTheme = (config: ThemeConfig): ThemeConfig => config

const isColor = (node: unknown): node is PaletteColor =>
  typeof node === 'string' || (typeof node === 'object' && node !== null && ('native' in node || 'adaptive' in node))

type PaletteNode = PaletteColor | {[segment: string]: PaletteNode}

/**
 * Replaces colours, never merges into one: a `native(...)` or `adaptive(...)` reference is a leaf, so overriding it
 * with a hex swaps the whole entry rather than leaving a hex beside a stale `native` key.
 */
const mergeNode = (base: PaletteNode, override: unknown): PaletteNode => {
  if (override === undefined) {
    return base
  }

  if (isColor(base) || isColor(override)) {
    return override as PaletteColor
  }

  const overrides = override as Record<string, unknown>

  return Object.fromEntries(
    Object.entries(base).map(([segment, child]) => [segment, mergeNode(child, overrides[segment])])
  )
}

/** The default palette with the app's overrides applied. Returns the default itself when there are none. */
export const mergePalette = (overrides?: PaletteOverrides): Palette =>
  overrides ? (mergeNode(palette as unknown as PaletteNode, overrides) as unknown as Palette) : palette
