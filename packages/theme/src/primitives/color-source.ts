import type {MaterialColors} from '@expo/ui/jetpack-compose'

import {orange} from './colors'

/**
 * A Material 3 colour role, as `@expo/ui` names them. Derived from its palette type rather than written out, so a
 * role renamed upstream fails here instead of resolving to `undefined` at runtime.
 */
export type MaterialRole = keyof MaterialColors

/**
 * A UIKit semantic colour in its Objective-C selector form. The `Color` suffix is not decoration: React Native looks
 * the name up in a table keyed exactly this way, while `expo-modules-core` appends `Color` to anything lacking it —
 * so this spelling is the only one *both* bridges accept, and both are in play (the `Rn*` tier resolves through
 * React Native, the native atoms through `@expo/ui`).
 *
 * This is React Native's own table, minus two: `unitTestFallbackColor`, which is its internal test hook, and
 * `gridColor`, which is `NSColor` on macOS and has no `UIColor` counterpart to resolve to.
 */
export type IosSemanticColor =
  | 'blueColor'
  | 'clearColor'
  | 'darkTextColor'
  | 'labelColor'
  | 'lightTextColor'
  | 'linkColor'
  | 'opaqueSeparatorColor'
  | 'placeholderTextColor'
  | 'quaternaryLabelColor'
  | 'quaternarySystemFillColor'
  | 'secondaryLabelColor'
  | 'secondarySystemBackgroundColor'
  | 'secondarySystemFillColor'
  | 'secondarySystemGroupedBackgroundColor'
  | 'separatorColor'
  | 'systemBackgroundColor'
  | 'systemBlueColor'
  | 'systemBrownColor'
  | 'systemCyanColor'
  | 'systemFillColor'
  | 'systemGray2Color'
  | 'systemGray3Color'
  | 'systemGray4Color'
  | 'systemGray5Color'
  | 'systemGray6Color'
  | 'systemGrayColor'
  | 'systemGreenColor'
  | 'systemGroupedBackgroundColor'
  | 'systemIndigoColor'
  | 'systemMintColor'
  | 'systemOrangeColor'
  | 'systemPinkColor'
  | 'systemPurpleColor'
  | 'systemRedColor'
  | 'systemTealColor'
  | 'systemYellowColor'
  | 'tertiaryLabelColor'
  | 'tertiarySystemBackgroundColor'
  | 'tertiarySystemFillColor'
  | 'tertiarySystemGroupedBackgroundColor'

/** Our own light and dark values, and optionally what to use when the platform asks for increased contrast. */
export type AdaptiveTuple = {
  dark: string
  /** Used instead of `dark` under an increased-contrast preference. iOS only — Android exposes no such signal here. */
  highContrastDark?: string
  /** Used instead of `light` under an increased-contrast preference. iOS only. */
  highContrastLight?: string
  light: string
}

/**
 * One entry's definition. The two platform names are independent, which is the point: a designer hands a token to
 * iOS, to Android, to both, or to neither, and our own values stand in wherever a platform was not given a name.
 *
 * A union rather than one record with everything optional, so the two cases stay honest. Name both platforms and
 * there is nowhere for light/dark values to be used, so the type does not accept them — dead values that *look* like
 * they define the colour are worse than none. Name one platform or neither and the values become required, because
 * something has to answer on the other side.
 */
export type NativeColorSource =
  | {android: MaterialRole; ios: IosSemanticColor}
  | (AdaptiveTuple & {android?: MaterialRole; ios?: IosSemanticColor})

export type NativeColorRef<TSource extends NativeColorSource = NativeColorSource> = {native: TSource}

/**
 * A reference whose iOS side is a UIKit semantic colour. That is the one colour no JS can dim: iOS hands back an opaque
 * `PlatformColor`, evaluated per trait. Every other kind can — our own hexes on iOS, and on Android a Material role
 * arrives as a hex like everything else.
 */
export type IosSemanticColorRef = {native: {ios: IosSemanticColor}}

export type AdaptiveColorRef = {adaptive: AdaptiveTuple}

/** One authored colour. The `string` case is a plain hex, identical in both appearances — nothing to switch. */
export type PaletteColor = AdaptiveColorRef | NativeColorRef | string

/**
 * A colour `:oNN` can still scale: ours (a hex or an adaptive pair), or the platform's on Android only — which is how
 * an accent follows Material You without giving up its dimmed variants.
 */
export type DimmableColor =
  | AdaptiveColorRef
  | string
  | NativeColorRef<AdaptiveTuple & {android?: MaterialRole; ios?: never}>

/**
 * Prefers the platform's own colour, per platform, and falls back to ours where a platform has no name for it. Where a
 * name is given the platform resolves it — natively, inside the appearance cross-fade, with increased contrast handled
 * for us. This does *not* redefine the platform's colour; changing what `labelColor` itself is means shipping an asset
 * catalog entry of that name, which is a config-plugin job and deliberately not modelled here.
 *
 * Dimmable only while iOS gets our own values. A UIKit semantic colour is an opaque handle with no alpha channel for
 * us to scale, and having `:oNN` silently fall back to our values would make one token mean two colours. A Material
 * role is fine: Android hands it over as a hex. The source's literal shape is kept in the type, so the palette's
 * `DimmableToken` can tell the two apart.
 */
export const native = <const TSource extends NativeColorSource>(source: TSource): NativeColorRef<TSource> => ({
  native: source,
})

/**
 * Our values on both platforms, still chosen by the platform where it can. On iOS this becomes a trait-reactive
 * `UIColor`, so UIKit picks the branch while drawing and honours the window-level override the theme preference sets.
 * Android has no per-colour equivalent, so the active variant's value is chosen there.
 *
 * Dimmable, and mirrored into `theme.rgba`, because we own every hex in it.
 */
export const adaptive = (tuple: AdaptiveTuple): AdaptiveColorRef => ({adaptive: tuple})

/**
 * The two ends of the increased-contrast scale, spelled out because the direction flips with what is being coloured
 * and picking the wrong one is invisible until someone turns the setting on: a *surface* goes pure white in light mode
 * and pure black in dark, and content on it does the opposite.
 *
 * For a neutral only. An accent forced to white stops being the accent — a brand colour wants a stronger version of
 * *itself* here instead.
 */
export const MAX_CONTRAST_SURFACE = {highContrastDark: 'black', highContrastLight: 'white'} as const

export const MAX_CONTRAST_CONTENT = {highContrastDark: 'white', highContrastLight: 'black'} as const

/**
 * The colour Android's Material 3 scheme is generated from, unless the theme names its own (`ThemeConfig.materialSeed`).
 * It has exactly one job, and two consumers that must agree on it: the `<Host>` that themes the Compose subtree, and
 * the palette that resolves our own tokens. A Material control colours itself from the host's scheme, so two schemes
 * grown from different seeds would put its controls and our surfaces on visibly different tones — which is why both
 * read it off the theme, never from here.
 *
 * A theme's `materialSeed: null` hands the scheme to the device wallpaper instead — real Material You, at the cost of
 * the accent no longer relating to the neutrals around it.
 */
export const defaultMaterialSeed: string = orange[11]
