import type {ScrollEdgeEffect, ScrollEdgeScrollableProps} from '@hzblj/kara-native/swift-ui'
import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactElement, ReactNode} from 'react'

export type {ScrollEdgeEffect, ScrollEdgeScrollableProps} from '@hzblj/kara-native/swift-ui'

/**
 * Bars over one React Native scroll view, with each platform's scroll edge under them: on iOS 26 the system's
 * progressive blur where content scrolls past a bar; on Android a Material top app bar's behaviour, the bars stacked
 * around the scroll view and filling with `surface.secondary` once content scrolls under them. The React Native tier:
 * it needs no host.
 *
 * A screen-level container: wrap the screen's scroll view with it. Mounted inside a cell of a virtualized list on iOS
 * it draws only its bottom bar; the hosted scroll view and the top bar stay blank.
 */
export type ScrollEdgeContainerProps = ResponsiveViewSx & {
  /**
   * iOS: adds the bars' heights to the scroll view's own `contentInset` and starts it at the top of that inset, so the
   * content begins below the top bar and scrolls under it. On by default.
   */
  automaticInsets?: boolean
  /** Laid over the scroll view's bottom edge on iOS; stacked below it on Android, filled while content continues below. */
  bottomBar?: ReactNode
  /** Exactly one React Native scroll view: `RnScrollView`, `RnFlatList`, `RnSectionList`. */
  children: ReactElement<ScrollEdgeScrollableProps>
  /** iOS 26: the tab bar minimises as this scroll view scrolls, not as the screen's first one does. */
  contentScrollView?: boolean
  /** iOS 26: how hard the edge cuts. `soft` by default. */
  effect?: ScrollEdgeEffect
  /** iOS: the bottom bar's height before it is measured, so the first frame already has the inset. */
  initialBottomBarHeight?: number
  /** iOS: the top bar's height before it is measured, so the first frame's content starts below the bar. */
  initialTopBarHeight?: number
  /** Test identifier, forwarded to the container view. */
  testID?: string
  /** Laid over the scroll view's top edge on iOS; stacked above it on Android, filled once content scrolls under it. */
  topBar?: ReactNode
  /** iOS 26: hides the top edge effect, e.g. while a cover image sits under the top bar. */
  topEdgeEffectHidden?: boolean
}

export type ScrollEdgeContainerComponent = (props: ScrollEdgeContainerProps) => ReactNode
