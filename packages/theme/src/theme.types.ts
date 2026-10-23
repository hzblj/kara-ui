import type {ColorValue} from 'react-native'
import type {IosSemanticColorRef, PaletteColor} from './primitives/color-source'
import type {OpacitySize} from './primitives/opacity'
import type {FontsConfig, Typography} from './primitives/typography'
import type {PaletteResolver} from './system/palette-resolver.types'
import type {Palette} from './themes/palette'

/**
 * Every dotted path from a colour group down to a colour (`accent.primary`, `on.accent`). Derived from the group's
 * own shape, so a colour added to the palette gets its token without a second edit. A system reference is a leaf
 * here like any other: it is a colour, just not one we can read.
 */
type ColorPaths<TGroup> = {
  [TKey in keyof TGroup & string]: TGroup[TKey] extends PaletteColor ? TKey : `${TKey}.${ColorPaths<TGroup[TKey]>}`
}[keyof TGroup & string]

/**
 * The subset of `ColorPaths` an opacity token may be applied to: every colour except one whose iOS side is a UIKit
 * semantic colour. That one resolves to a value no JS can take the alpha channel of (an opaque `UIColor`, evaluated
 * per trait), so `surface.base:o50` is a compile error rather than a no-op. A Material role on Android is not such a
 * case: it arrives as a hex, so `native({android: 'primary', light, dark})` dims on both platforms.
 *
 * That is also the platform's own advice: `secondaryLabel` and `tertiaryLabel` *are* pre-dimmed
 * `label`, so the way to quieten a system colour is to name the quieter one.
 */
type DimmablePaths<TGroup> = {
  [TKey in keyof TGroup & string]: TGroup[TKey] extends IosSemanticColorRef
    ? never
    : TGroup[TKey] extends PaletteColor
      ? TKey
      : `${TKey}.${DimmablePaths<TGroup[TKey]>}`
}[keyof TGroup & string]

export type BorderToken = ColorPaths<Palette['border']>

export type BtnToken = ColorPaths<Palette['btn']>

export type ContentToken = ColorPaths<Palette['content']>

export type FillToken = ColorPaths<Palette['fill']>

export type SurfaceToken = ColorPaths<Palette['surface']>

export type ThemeVariant = 'dark' | 'light'

export type ThemePreference = ThemeVariant | 'system'

/** The groups holding plain colours. `shadow` is the one that is not: its values are geometry-bound triples. */
export type ColorFamily = Exclude<keyof Palette, 'shadow'>

/**
 * Every dimmable colour in a group swapped for a call that dims it, at whatever depth it sits. UIKit semantic
 * references are dropped by the key remapping rather than typed as something that throws: `theme.rgba.surface`
 * simply has no `base`, and the compiler says so at the call site.
 */
type AlphaGroup<TGroup> = {
  [TKey in keyof TGroup as TGroup[TKey] extends IosSemanticColorRef ? never : TKey]: TGroup[TKey] extends PaletteColor
    ? (size: OpacitySize) => ResolvedColor
    : AlphaGroup<TGroup[TKey]>
}

export type RgbaPalette = {
  [TFamily in ColorFamily]: AlphaGroup<Palette[TFamily]>
}

/**
 * Resolves a token against this theme: `theme.color('fill.accent.primary')`. It carries the whole job (walking
 * the palette, deferring a system reference to the platform, applying an `:oNN` suffix), so a call site holding a
 * theme never reaches for a helper.
 */
export type ColorResolver = (token: ColorToken) => ColorValue

/**
 * The same resolution, narrowed to `string`, for the handful of `@expo/ui` props still declared that way
 * upstream: Compose `Text.color`, `Picker.Item.color`, `SegmentedControl.tintColor`. Each forwards the value
 * into a SwiftUI `Color`, a Compose `Color` field or a React Native style, all of which take a full
 * `ColorValue`, so this narrows a declaration that is too tight rather than a value that is not a string.
 */
export type ColorStringResolver = (token: ColorToken) => string

/**
 * What a token resolves to: a hex string or, for a system reference on iOS, an opaque handle the platform
 * evaluates itself. Re-exported under our own name so a consumer holding a resolved colour does not have to
 * reach into `react-native` for the type, which is quarantined away from features for good reason.
 */
export type ResolvedColor = ColorValue

/** The palette plus its opacity mirror. */
export type AuthoredTheme = Palette & {
  /**
   * The half of the palette we own the hex of, mirrored, each colour callable with an `opacity` token:
   * `theme.rgba.fill.accent.primary('o80')`, the same colour as `theme.color('fill.accent.primary:o80')`. It has
   * to live beside the colours rather than on them: a string cannot carry a method, and boxing it into a `String`
   * object makes both native bridges drop the colour, since each one tests for a primitive string.
   */
  rgba: RgbaPalette
}

export type Theme = AuthoredTheme & {
  /** Resolves any token: the one call a component needs. */
  color: ColorResolver
  /** `color`, narrowed for the props that still insist on a `string`. */
  colorString: ColorStringResolver
  /**
   * Whether the app is currently in its dark appearance. Not a palette value any more: it comes from the resolved
   * variant, and it is what the native hosts and the `sx` caches key on.
   */
  dark: boolean
  /**
   * Whether Android's Material scheme follows the device wallpaper right now: the app asked for `dynamicColor` and the
   * OS has it (Android 12+). Always `false` on iOS, which has no wallpaper-derived colours.
   */
  dynamicColor: boolean
  /**
   * The app's faces as configured (`{}` on the platform's own face). For text a variant does not cover; see
   * `fontFace`.
   */
  fonts: FontsConfig
  /**
   * The seed Android's Material scheme was generated from: the app's `materialSeed`, or `undefined` when the scheme
   * follows the wallpaper. The native hosts hand the same value to `<Host seedColor>`, so Compose controls and the
   * palette's Material roles come from one scheme.
   */
  materialSeed: string | undefined
  /** The palette this theme resolves: the default with the app's overrides applied. */
  palette: Palette
  /** What `color` defers to for an entry the platform owns or adapts. */
  resolver: PaletteResolver
  /** Every text variant, ready to use: the platform's face by default, the app's own when the theme names one. */
  typography: Typography
}

/** A colour that exists in the palette, named `family.path` (`surface.primary`, `fill.accent.base`). */
export type PaletteToken = {
  [TFamily in ColorFamily]: `${TFamily}.${ColorPaths<Palette[TFamily]>}`
}[ColorFamily]

/** The palette tokens whose colour this repo owns the hex of, and can therefore dim. */
export type DimmableToken = {
  [TFamily in ColorFamily]: `${TFamily}.${DimmablePaths<Palette[TFamily]>}`
}[ColorFamily]

/**
 * A palette colour, optionally dimmed by an `opacity` token (`fill.accent.primary:o80`). The suffix
 * multiplies the colour's own alpha instead of replacing it, so it composes with the `*Alpha`
 * primitives: `fill.accent.base:o50` is half of whatever `fill.accent.base` already was. Only
 * `DimmableToken`s take it; see `DimmablePaths`.
 */
export type ColorToken = PaletteToken | `${DimmableToken}:${OpacitySize}`
