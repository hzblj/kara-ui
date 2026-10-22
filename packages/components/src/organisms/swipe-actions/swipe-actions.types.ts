import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/** One button a swiped row uncovers. */
export type SwipeAction = {
  /** Fills the button with `fill.destructive.primary` unless `tint` says otherwise. */
  destructive?: boolean
  /** One of the app's icons, on the button — a round one on iOS 26, as in Mail, a filled stadium on Android. */
  icon: IconName
  /**
   * The action's name, written under the button — before iOS 26 a row of the usual height shows the icon alone and
   * keeps the label for VoiceOver. Actions are keyed by it, so keep labels unique within one row.
   */
  label: string
  /** Called when the button is pressed. The row closes by itself. */
  onPress: () => void
  /**
   * The button's fill — `fill.destructive.primary` for a destructive action, `fill.accent.primary` otherwise. The icon
   * on it is white, so pick a fill that holds white in both appearances.
   */
  tint?: ColorToken
}

/**
 * A list row with buttons behind it, uncovered by a swipe — SwiftUI's `swipeActions` on iOS, and on Android, where
 * Compose has none, kara's own: the row slides on an anchored drag and the buttons show in the strip it leaves. One
 * row is open at a time on both; a tap on an open row closes it. A native organism — it belongs inside a `List`.
 */
export type SwipeActionsProps = {
  /**
   * iOS: a swipe all the way across performs the edge's first action, as in Mail. Android has no full swipe. `true`
   * by default, as in SwiftUI.
   */
  allowsFullSwipe?: boolean
  /** The row. */
  children: ReactNode
  /** The buttons at the leading edge, uncovered by a swipe toward the trailing one. The first sits outermost. */
  leading?: SwipeAction[]
  /** Test identifier. iOS: on the row. Android: the row is a Compose node, reach it by its content. */
  testID?: string
  /** The buttons at the trailing edge, uncovered by a swipe toward the leading one. The first sits outermost. */
  trailing?: SwipeAction[]
}

export type SwipeActionsComponent = (props: SwipeActionsProps) => ReactNode
