import type {ColorValue} from 'react-native'

import type {NavigationTitleTransition} from '../../navigation-title-transition'

export type {
  NavigationTitleEasing,
  NavigationTitleLineMotion,
  NavigationTitleTiming,
  NavigationTitleTransition,
  NavigationTitleTransitionConfig,
  NavigationTitleTransitionPreset,
} from '../../navigation-title-transition'

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
  /** Hides the title and subtitle, for a title revealed on scroll. Showing and hiding play `transition`. */
  subtitleHidden?: boolean
  /** How the title and subtitle come in and leave as `subtitleHidden` changes. `rise` by default. */
  transition?: NavigationTitleTransition
}
