import {Platform} from 'react-native'

/**
 * The platform text style a variant grows *with*. It does not set the size — ours below stays exact — it picks the
 * rate: the size is scaled by whatever the user's Dynamic Type setting does to that style, for the platform's face and
 * an app's own alike (`Font.custom(_:size:relativeTo:)` for one, `UIFontMetrics` for the other — see the native
 * `scaledFont` modifier). So `displayXl` still starts at 56pt, and grows the way a `largeTitle` grows.
 *
 * Without one, a fixed-size font ignores Dynamic Type entirely, and native text becomes the only text on an iOS screen
 * that does not respond to the setting.
 */
export type IosTextStyle =
  | 'body'
  | 'callout'
  | 'caption'
  | 'caption2'
  | 'footnote'
  | 'headline'
  | 'largeTitle'
  | 'subheadline'
  | 'title'
  | 'title2'
  | 'title3'

/** The weights a text variant can ask for. Named rather than numeric, because SwiftUI names them too. */
export type FontWeight = 'bold' | 'medium' | 'regular' | 'semibold'

/**
 * Which face family a variant is set in. `display` covers the headings and the large sizes, so a typeface with a
 * separate display cut (the way Inter has one) can be given it; without one, `display` falls back to `text`. `mono` is
 * the fixed-width face a `monospaced` text is set in, at its variant's size and weight; without one of the app's own it
 * falls back to the platform's, never to `text`, since a proportional face cannot stand in for a fixed-width one.
 */
export type FontRole = 'display' | 'mono' | 'text'

export type TextStyleToken = {
  fontSize: number
  lineHeight: number
  role: FontRole
  /** Which platform text style this grows with. Paired by nearest default size, so the rate reads as natural. */
  scalesWith: IosTextStyle
  weight: FontWeight
}

/**
 * The type scale. No family is named here: by default every variant is set in the platform's own face — SF Pro on
 * iOS, Roboto on Android — and a typeface of the app's own arrives through the theme's `fonts`, which maps each
 * role's weights to the faces the app registered (see `resolveTypography`).
 */
export const textStyles = {
  body: {fontSize: 16, lineHeight: 24, role: 'text', scalesWith: 'body', weight: 'medium'},
  caption: {fontSize: 11, lineHeight: 16, role: 'text', scalesWith: 'caption2', weight: 'regular'},
  captionMedium: {fontSize: 11, lineHeight: 16, role: 'text', scalesWith: 'caption2', weight: 'medium'},
  cardSubtitle: {fontSize: 12, lineHeight: 16, role: 'text', scalesWith: 'caption', weight: 'regular'},
  cardTitle: {fontSize: 14, lineHeight: 24, role: 'text', scalesWith: 'subheadline', weight: 'regular'},
  displayL: {fontSize: 48, lineHeight: 56, role: 'display', scalesWith: 'largeTitle', weight: 'medium'},
  displayXl: {fontSize: 56, lineHeight: 64, role: 'display', scalesWith: 'largeTitle', weight: 'medium'},
  footnote: {fontSize: 13, lineHeight: 18, role: 'text', scalesWith: 'footnote', weight: 'regular'},
  footnoteMedium: {fontSize: 13, lineHeight: 18, role: 'text', scalesWith: 'footnote', weight: 'medium'},
  headingL: {fontSize: 32, lineHeight: 40, role: 'display', scalesWith: 'title', weight: 'medium'},
  headingM: {fontSize: 28, lineHeight: 36, role: 'display', scalesWith: 'title', weight: 'medium'},
  headingS: {fontSize: 24, lineHeight: 32, role: 'display', scalesWith: 'title2', weight: 'medium'},
  headingXl: {fontSize: 40, lineHeight: 48, role: 'display', scalesWith: 'largeTitle', weight: 'medium'},
  headingXs: {fontSize: 20, lineHeight: 28, role: 'text', scalesWith: 'title3', weight: 'medium'},
  headline: {fontSize: 18, lineHeight: 28, role: 'text', scalesWith: 'headline', weight: 'medium'},
  label: {fontSize: 12, lineHeight: 16, role: 'text', scalesWith: 'caption', weight: 'regular'},
  labelMedium: {fontSize: 12, lineHeight: 16, role: 'text', scalesWith: 'caption', weight: 'medium'},
  subheadline: {fontSize: 14, lineHeight: 20, role: 'text', scalesWith: 'subheadline', weight: 'regular'},
  subheadlineMedium: {fontSize: 14, lineHeight: 20, role: 'text', scalesWith: 'subheadline', weight: 'medium'},
} as const satisfies Record<string, TextStyleToken>

export type TextVariant = keyof typeof textStyles

/** The numeric weight React Native and Compose take, for a variant set in the platform's own face. */
export const FONT_WEIGHT_VALUES = {
  bold: '700',
  medium: '500',
  regular: '400',
  semibold: '600',
} as const satisfies Record<FontWeight, string>

/**
 * The app's own faces for one role, by weight — the names the app registered them under (with `expo-font`, the
 * filename). Each face *is* its weight, so the platform is not asked to synthesise one: a weight without a face falls
 * back to the role's `regular`, then to the platform's own face at that weight.
 */
export type FontFaces = Partial<Record<FontWeight, string>>

export type FontsConfig = {
  /** Headings and display sizes. Falls back to `text` when not given. */
  display?: FontFaces
  /**
   * The fixed-width face, for text set `monospaced`: code, an order number, figures in a column. Falls back to the
   * platform's own (Menlo on iOS, Android's `monospace`), never to `text`.
   */
  mono?: FontFaces
  /** Everything else. Omit `fonts` entirely to stay on the platform's own face. */
  text?: FontFaces
}

/**
 * A variant as a component consumes it — a ready React Native / Compose text style plus what SwiftUI needs. A face of
 * the app's own (or Menlo) carries its weight in the face and sets `fontFamily` alone; the platform's face takes the
 * weight as a number, `fontWeight` alone, and so does Android's `monospace` family, which sets both.
 */
export type ResolvedTextStyle = {
  fontFamily?: string
  fontSize: number
  fontWeight?: (typeof FONT_WEIGHT_VALUES)[FontWeight]
  lineHeight: number
  scalesWith: IosTextStyle
  weight: FontWeight
}

export type Typography = Record<TextVariant, ResolvedTextStyle>

/**
 * The face the app registered for a weight in a role: the exact weight, else the role's `regular`, else `undefined` —
 * the platform's own face. `display` falls back to `text` as a whole, not weight by weight, so a display family is
 * never mixed with a text one inside the same heading scale. `mono` falls back to nothing of the app's: `undefined`
 * there means the platform's fixed-width face.
 */
export const fontFace = (
  fonts: FontsConfig | undefined,
  weight: FontWeight,
  role: FontRole = 'text'
): string | undefined => {
  const faces = role === 'mono' ? fonts?.mono : ((role === 'display' ? fonts?.display : undefined) ?? fonts?.text)

  return faces?.[weight] ?? faces?.regular
}

type ResolvedFace = Pick<ResolvedTextStyle, 'fontFamily' | 'fontWeight'>

/**
 * The platform's own fixed-width face. Menlo on iOS, by face: SF Mono has no name an app can ask for, and React Native
 * can only ask by name, so a native `Text` and an `RnText` set the same face. Android's `monospace` is a family, which
 * takes its weight as a number, the way Roboto does.
 */
const PLATFORM_MONO: FontsConfig = {mono: {bold: 'Menlo-Bold', regular: 'Menlo-Regular'}}

const platformMono = (weight: FontWeight): ResolvedFace =>
  Platform.OS === 'android'
    ? {fontFamily: 'monospace', fontWeight: FONT_WEIGHT_VALUES[weight]}
    : {fontFamily: fontFace(PLATFORM_MONO, weight, 'mono')}

const faceOf = (fonts: FontsConfig | undefined, weight: FontWeight, role: FontRole): ResolvedFace => {
  const fontFamily = fontFace(fonts, weight, role)

  if (fontFamily) {
    return {fontFamily}
  }

  return role === 'mono' ? platformMono(weight) : {fontWeight: FONT_WEIGHT_VALUES[weight]}
}

/**
 * The scale with the app's faces applied. Built once per theme config by the provider, so a text component reads a
 * finished style off the theme rather than resolving faces on every render. `role` sets every variant in one role
 * instead of its own: `mono` is the scale a `monospaced` text reads (`theme.monoTypography`).
 */
export const resolveTypography = (fonts?: FontsConfig, role?: FontRole): Typography => {
  const entries = Object.entries(textStyles) as [TextVariant, TextStyleToken][]

  return Object.fromEntries(
    entries.map(([variant, token]) => [
      variant,
      {
        ...faceOf(fonts, token.weight, role ?? token.role),
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        scalesWith: token.scalesWith,
        weight: token.weight,
      },
    ])
  ) as Typography
}

/**
 * How far text is allowed to grow. Apple's own guidance is to cap rather than switch Dynamic Type off, because a
 * capped layout still answers the setting while an opted-out one ignores a user who needs it.
 *
 * `<Screen>` and `<Island>` set this on their host, so it cascades through the SwiftUI environment to every native
 * atom below. Android has no counterpart through `@expo/ui` — Compose reads `sp`, which the OS scales without asking
 * — so text there grows uncapped.
 */
export const MAX_DYNAMIC_TYPE_SIZE = 'accessibility3' as const

/** The `body` style's point size at each Dynamic Type step, as Apple publishes it. */
const BODY_POINTS = {accessibility3: 40, large: 17} as const

/**
 * The same ceiling for the React Native tier, which caps by multiplier rather than by named size. Derived from the
 * two sizes above so the two tiers stop growing in the same place rather than by two hand-picked numbers.
 */
export const MAX_FONT_SCALE = BODY_POINTS.accessibility3 / BODY_POINTS.large
