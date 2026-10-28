import type {ColorValue} from 'react-native'

export type NavigationItemSubtitleProps = {
  /** The subtitle's colour. The system's secondary label colour by default. */
  color?: ColorValue
  /** The subtitle's face. The system font, medium, by default. */
  fontFamily?: string
  /** The subtitle's size in points. */
  fontSize?: number
  /** The subtitle's tracking in points. */
  letterSpacing?: number
  /** The line under the screen's title. */
  subtitle: string
  /** Hides the subtitle with a cross-dissolve of the bar, for a title revealed on scroll. */
  subtitleHidden?: boolean
}
