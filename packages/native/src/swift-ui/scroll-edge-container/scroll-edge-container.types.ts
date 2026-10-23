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
  effect?: ScrollEdgeEffect
  style?: StyleProp<ViewStyle>
  testID?: string
  topBar?: ReactNode
}
