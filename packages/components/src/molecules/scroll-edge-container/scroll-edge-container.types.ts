import type {ScrollEdgeEffect, ScrollEdgeScrollableProps} from '@hzblj/kara-native/swift-ui'
import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactElement, ReactNode} from 'react'

export type {ScrollEdgeEffect, ScrollEdgeScrollableProps} from '@hzblj/kara-native/swift-ui'

/**
 * Bars over one React Native scroll view, with the iOS 26 scroll edge effect under them — the system's progressive
 * blur where content scrolls past a bar. The React Native tier: it needs no host.
 */
export type ScrollEdgeContainerProps = ResponsiveViewSx & {
  /**
   * iOS: adds the bars' heights to the scroll view's own `contentInset` and starts it at the top of that inset, so the
   * content begins below the top bar and scrolls under it. On by default.
   */
  automaticInsets?: boolean
  bottomBar?: ReactNode
  /** Exactly one React Native scroll view — `RnScrollView`, `RnFlatList`, `RnSectionList`. */
  children: ReactElement<ScrollEdgeScrollableProps>
  /** iOS 26: how hard the edge cuts. `soft` by default. */
  effect?: ScrollEdgeEffect
  testID?: string
  topBar?: ReactNode
}

export type ScrollEdgeContainerComponent = (props: ScrollEdgeContainerProps) => ReactNode
