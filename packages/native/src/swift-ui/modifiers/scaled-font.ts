import {createModifier} from '@expo/ui/swift-ui/modifiers'

export type ScaledFontWeight = 'bold' | 'medium' | 'regular' | 'semibold'

/** The platform text style whose Dynamic Type curve the size follows — the names `@expo/ui`'s `font()` takes. */
export type ScaledFontTextStyle =
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

export type ScaledFontParams = {
  /** A registered font's name. Unset means the system face. */
  family?: string
  /** In points, at the default Dynamic Type size. */
  size: number
  /** Defaults to `body`. */
  textStyle?: ScaledFontTextStyle
  /** Applied to the system face only — with a `family` the face is the weight. Defaults to `regular`. */
  weight?: ScaledFontWeight
}

/**
 * An exact size that still answers Dynamic Type — for a custom face (`Font.custom(_:size:relativeTo:)`) and for the
 * system one, which `font()` cannot do: there a system font is either Apple's size for a text style or a fixed size
 * that ignores the setting.
 */
export const scaledFont = (params: ScaledFontParams) => createModifier('scaledFont', params)
