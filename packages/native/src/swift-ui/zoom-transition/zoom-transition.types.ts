import type {ReactElement} from 'react'
import type {ColorValue} from 'react-native'

export type ZoomTransitionSourceProps = {
  /** A single native child: the view the zoom grows from. */
  children: ReactElement
  identifier: string
}

export type ZoomTransitionTargetProps = {
  /** A single native child: the frame the source lands on in the pushed screen. */
  children: ReactElement
  identifier: string
  /** Lands the source in a rect of its own aspect ratio centred in the target, so it is not stretched. Default `true`. */
  isAspectRatioMatched?: boolean
}

export type ZoomTransitionDimmingBlur = 'regular' | 'thick' | 'thin' | 'ultraThin'

export type ZoomTransitionEnablerProps = {
  /** Laid over the screen behind the zoomed one. Unset is UIKit's own dimming. */
  dimmingColor?: ColorValue
  /** Blurs the screen behind the zoomed one with a system material. */
  dimmingBlur?: ZoomTransitionDimmingBlur
  /** Whether UIKit's swipe down, edge swipe and pinch may dismiss the screen back into its source. Default `true`. */
  isDismissalEnabled?: boolean
  /** Whether a rightward edge swipe and a pinch may dismiss it too, or only a downward drag. Default `true`. */
  isHorizontalDismissalEnabled?: boolean
  sourceIdentifier: string
}
