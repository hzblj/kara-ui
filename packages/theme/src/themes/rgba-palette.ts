import type {NativeColorRef, PaletteColor} from '../primitives/color-source'
import type {OpacitySize} from '../primitives/opacity'
import type {ColorFamily, ColorResolver, ColorToken, RgbaPalette} from '../theme.types'
import type {Palette} from './palette'

/** A colour group as it looks to a walk that does not know how deep the colours sit. */
type ColorNode = PaletteColor | {[segment: string]: ColorNode}

const isNativeRef = (node: ColorNode): node is NativeColorRef =>
  typeof node === 'object' && node !== null && 'native' in node

/** A reference iOS resolves to a UIKit semantic colour — the one kind there is no alpha channel to scale. */
const isIosSemantic = (node: ColorNode): boolean =>
  isNativeRef(node) && 'ios' in node.native && Boolean(node.native.ios)

const isColor = (node: ColorNode): boolean =>
  typeof node === 'string' || (typeof node === 'object' && node !== null && ('adaptive' in node || 'native' in node))

/**
 * Listed as a record rather than an array so the compiler demands every family: a colour group added
 * to `Palette` cannot then quietly miss its `rgba` mirror.
 */
const COLOR_FAMILIES = {
  border: true,
  btn: true,
  content: true,
  fill: true,
  surface: true,
} as const satisfies Record<ColorFamily, true>

/**
 * Every dimmable colour — a hex, an `adaptive(...)` pair, or a reference that leaves iOS to us — becomes a call that
 * resolves its own token with an `:oNN` suffix, so the mirror dims exactly the way `theme.color('fill.accent.base:o50')`
 * does. UIKit semantic references are dropped rather than mirrored — there is no alpha channel to scale — and
 * `AlphaGroup` remaps the same keys away, so reaching for one is a compile error, not a silent no-op.
 */
const alphaGroup = (node: ColorNode, path: string, color: ColorResolver): unknown => {
  if (isColor(node)) {
    return (size: OpacitySize) => color(`${path}:${size}` as ColorToken)
  }

  return Object.fromEntries(
    Object.entries(node)
      .filter(([, child]) => !isIosSemantic(child))
      .map(([segment, child]) => [segment, alphaGroup(child, `${path}.${segment}`, color)])
  )
}

/** Built once per theme by the provider, not per render — a handful of closures over the theme's own `color`. */
export const rgbaPalette = (palette: Palette, color: ColorResolver): RgbaPalette => {
  const families = Object.keys(COLOR_FAMILIES) as ColorFamily[]

  return Object.fromEntries(
    families.map(family => [family, alphaGroup(palette[family] as ColorNode, family, color)])
  ) as RgbaPalette
}
