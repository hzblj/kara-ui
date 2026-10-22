import type {ReactElement} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type ZoomTransitionSourceProps = {
  /** The view the transform grows from. */
  children: ReactElement
  /** The corners the transform starts with, in dp — the source's own rounding. */
  cornerRadius?: number
  identifier: string
}

export type ZoomTransitionTargetProps = {
  /** The view the transform lands on. */
  children: ReactElement
  /** The corners the transform ends with, in dp. */
  cornerRadius?: number
  identifier: string
  /**
   * Lands on the photo inside the target — where a `contain` photo sits in a tall page — instead of on the whole
   * target. The photo's aspect ratio is read from the source's most visible image.
   */
  isFittedToSourceAspectRatio?: boolean
  /** A real layout box, unlike iOS: give it `flex` when its child fills the parent. */
  style?: StyleProp<ViewStyle>
}

export type ZoomTransitionEasing = 'decelerate' | 'emphasized' | 'linear' | 'standard'

export type ZoomTransitionFadeMode = 'cross' | 'in' | 'out' | 'through'

export type ZoomTransitionPathMotion = 'arc' | 'linear'

export type ZoomTransitionEnablerProps = {
  /** Material 3 emphasized (`0.2, 0, 0, 1`) by default. */
  easing?: ZoomTransitionEasing
  /** How the source and target contents fade into each other — `MaterialContainerTransform.FADE_MODE_*`. Default `cross`. */
  fadeMode?: ZoomTransitionFadeMode
  /** The path the container travels. Default `arc` (`MaterialArcMotion`). */
  pathMotion?: ZoomTransitionPathMotion
  /** Drawn over the screen behind the transform. Default transparent. */
  scrimColor?: ColorValue
  sourceIdentifier: string
  /** In ms. Default 450. */
  transformDuration?: number
}
