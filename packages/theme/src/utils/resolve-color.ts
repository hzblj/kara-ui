import type {ColorValue} from 'react-native'
import {
  type AdaptiveColorRef,
  adaptive,
  type NativeColorRef,
  native,
  type PaletteColor,
} from '../primitives/color-source'
import {type OpacitySize, opacity as opacityTokens} from '../primitives/opacity'
import type {ColorFamily, ColorToken, PaletteToken, Theme} from '../theme.types'

/** A colour group as it looks to a walk that does not know how deep the token goes. */
type ColorNode = PaletteColor | {[segment: string]: ColorNode}

/**
 * Tells the two kinds of reference from the group that contains them. All three are objects, so the discriminators
 * are the keys only a reference carries — safe because no palette group is allowed to name a colour `native` or
 * `adaptive`.
 */
const isNativeRef = (node: ColorNode | undefined): node is NativeColorRef =>
  typeof node === 'object' && node !== null && 'native' in node

const isAdaptiveRef = (node: ColorNode | undefined): node is AdaptiveColorRef =>
  typeof node === 'object' && node !== null && 'adaptive' in node

const HEX_RGB_LENGTH = 7
const HEX_RGBA_LENGTH = 9
const CHANNEL_MAX = 255

/** Every palette hex is written as `#rrggbb` or `#rrggbbaa` — the only forms both native sides parse. */
const alphaOf = (hex: string): number =>
  hex.length === HEX_RGBA_LENGTH ? Number.parseInt(hex.slice(HEX_RGB_LENGTH), 16) / CHANNEL_MAX : 1

const scaleAlpha = (hex: string, factor: number): string => {
  if (hex.length !== HEX_RGB_LENGTH && hex.length !== HEX_RGBA_LENGTH) {
    if (__DEV__) {
      throw new Error(`[kara-ui] Cannot apply opacity to "${hex}" — expected #rrggbb or #rrggbbaa.`)
    }

    return hex
  }

  const channel = Math.round(alphaOf(hex) * factor * CHANNEL_MAX)

  return `${hex.slice(0, HEX_RGB_LENGTH)}${channel.toString(16).padStart(2, '0')}`
}

/**
 * Dims a resolved colour by an `opacity` token. Multiplies the colour's own alpha rather than
 * replacing it, so dimming an already translucent primitive does what reading it suggests.
 */
export const withOpacity = (color: string, size: OpacitySize): string => scaleAlpha(color, opacityTokens[size])

const descend = (node: ColorNode | undefined, segment: string): ColorNode | undefined => {
  if (typeof node !== 'object' || node === null || isNativeRef(node) || isAdaptiveRef(node)) {
    return undefined
  }

  return node[segment]
}

const paletteColor = (theme: Theme, token: ColorToken, path: PaletteToken): PaletteColor => {
  const [family, ...rest] = path.split('.') as [ColorFamily, ...string[]]
  const value = rest.reduce(descend, theme[family] as ColorNode | undefined)

  if (typeof value !== 'string' && !isNativeRef(value) && !isAdaptiveRef(value)) {
    if (__DEV__) {
      throw new Error(`[kara-ui] Unknown colour token "${token}".`)
    }

    return native({android: 'onSurface', ios: 'labelColor'})
  }

  return value
}

/**
 * One authored palette entry, resolved for this platform: a hex stays itself, while either kind of reference goes to
 * the platform resolver — a `PlatformColor` or `DynamicColorIOS` handle on iOS, a Material role or the active
 * variant's own value on Android.
 */
export const resolvePaletteColor = (theme: Theme, value: PaletteColor): ColorValue => {
  if (isNativeRef(value)) {
    return theme.resolver.native(value)
  }

  return isAdaptiveRef(value) ? theme.resolver.adaptive(value) : value
}

/**
 * Dims an authored entry before it is resolved. An adaptive entry is dimmed branch by branch — we own every hex in
 * it — so the result is still a colour the platform picks from, not a snapshot of one branch.
 */
const dimPaletteColor = (value: AdaptiveColorRef | string, size: OpacitySize): AdaptiveColorRef | string => {
  if (typeof value === 'string') {
    return withOpacity(value, size)
  }

  const {dark, highContrastDark, highContrastLight, light} = value.adaptive

  return adaptive({
    dark: withOpacity(dark, size),
    highContrastDark: highContrastDark && withOpacity(highContrastDark, size),
    highContrastLight: highContrastLight && withOpacity(highContrastLight, size),
    light: withOpacity(light, size),
  })
}

/**
 * Dims a reference whose iOS side is ours. Android hands a Material role (or our value) back as a hex, which dims like
 * any other; iOS hands back a `DynamicColorIOS` over our pair, so the pair is dimmed before it is resolved — the result
 * stays a colour UIKit switches itself.
 */
const dimNativeColor = (theme: Theme, ref: NativeColorRef, size: OpacitySize): ColorValue => {
  const source = ref.native

  if (!('light' in source) || source.ios) {
    if (__DEV__) {
      throw new Error(`[kara-ui] A UIKit semantic colour cannot be dimmed; name a quieter one instead.`)
    }

    return theme.resolver.native(ref)
  }

  const resolved = theme.resolver.native(ref)

  if (typeof resolved === 'string') {
    return withOpacity(resolved, size)
  }

  const {dark, highContrastDark, highContrastLight, light} = source

  return resolvePaletteColor(theme, dimPaletteColor(adaptive({dark, highContrastDark, highContrastLight, light}), size))
}

export const resolveColor = (theme: Theme, token: ColorToken): ColorValue => {
  const [path, size] = token.split(':') as [PaletteToken, OpacitySize | undefined]
  const color = paletteColor(theme, token, path)

  if (size === undefined) {
    return resolvePaletteColor(theme, color)
  }

  if (opacityTokens[size] === undefined) {
    if (__DEV__) {
      throw new Error(`[kara-ui] Unknown opacity token ":${size}" in "${token}".`)
    }

    return resolvePaletteColor(theme, color)
  }

  // A UIKit semantic reference is unreachable here through `ColorToken` — only a `DimmableToken` may carry a suffix.
  // `dimNativeColor` still guards it, for a token that arrived from somewhere the compiler could not see.
  return isNativeRef(color)
    ? dimNativeColor(theme, color, size)
    : resolvePaletteColor(theme, dimPaletteColor(color, size))
}

/**
 * For the handful of `@expo/ui` props still declared `string` upstream — Compose `Text.color`,
 * `Picker.Item.color`, `SegmentedControl.tintColor` and their neighbours. Every one of them forwards the value
 * into a SwiftUI `Color`, a Compose `Color` field or a React Native style, all of which take a full
 * `ColorValue`; the assertion therefore narrows a declaration that is too tight, not a value that is not a
 * string. Reach for `resolveColor` unless the prop refuses it.
 */
export const resolveColorString = (theme: Theme, token: ColorToken): string => resolveColor(theme, token) as string
