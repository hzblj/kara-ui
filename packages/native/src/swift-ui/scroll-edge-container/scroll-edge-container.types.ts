import type {ReactElement, ReactNode} from 'react'
import type {Insets, PointProp, StyleProp, ViewStyle} from 'react-native'

export type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft'

/** What the container sets on its scroll view. Any React Native scroll view takes these. */
export type ScrollEdgeScrollableProps = {
  contentInset?: Insets
  contentOffset?: PointProp
  scrollIndicatorInsets?: Insets
}

export type ScrollEdgeContainerProps = {
  /**
   * Adds the bars' heights to the scroll view's `contentInset` (on top of its own) and starts it scrolled to the top
   * of that inset. On by default: a bar laid over padding rather than inset leaves UIKit's scroll pocket invisible
   * until the first scroll. Every inset side is a number, never `undefined`.
   */
  automaticInsets?: boolean
  bottomBar?: ReactNode
  /** Exactly one React Native scroll view. */
  children: ReactElement<ScrollEdgeScrollableProps>
  /**
   * Makes the scroll view its screen's content scroll view for the bottom edge, the one the iOS 26 tab bar watches to
   * minimise on scroll. UIKit otherwise takes the screen's first scroll view, which may be another one.
   */
  contentScrollView?: boolean
  effect?: ScrollEdgeEffect
  /**
   * The bottom bar's height until it is measured. The bars are measured after the first frame, so without it a newly
   * mounted container lays the scroll view out with no bottom inset for that frame.
   */
  initialBottomBarHeight?: number
  /**
   * The top bar's height until it is measured: a caller that already knows it (a pager page, a screen whose bar was
   * measured elsewhere) keeps the first frame's content from starting under the bar.
   */
  initialTopBarHeight?: number
  style?: StyleProp<ViewStyle>
  testID?: string
  topBar?: ReactNode
  /** Hides the top edge effect, e.g. while a cover image sits under the top bar. */
  topEdgeEffectHidden?: boolean
}
