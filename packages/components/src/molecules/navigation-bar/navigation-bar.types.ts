import type {ReactNode, Ref} from 'react'

import type {IconName} from '../../atoms/icon'

type NavigationBarItemBase = {
  /** Called when the item is pressed. */
  onPress: () => void
  /**
   * iOS 26: neighbouring items on one side share a glass capsule; this gives the item its own. A close next to
   * actions usually wants it. Material has no grouped capsules, so Android ignores it.
   */
  separated?: boolean
  /** iOS: the item's accessibility identifier; Android: its test tag. */
  testID?: string
}

/**
 * One item of the bar. `back` and `close` are the platform's own — a chevron and the system close item on iOS, the
 * Material arrow and cross on Android — with `Back` / `Close` as their labels unless given others. `icon` is one of the
 * app's icons and names itself for VoiceOver and TalkBack.
 */
export type NavigationBarItem =
  | (NavigationBarItemBase & {label?: string; type: 'back' | 'close'})
  | (NavigationBarItemBase & {icon: IconName; label: string; type: 'icon'})

export type NavigationBarSearchRef = {
  /** Empties the field and ends editing. */
  clear: () => void
}

/** A search field in place of the title — iOS only for now; Android keeps the title. */
export type NavigationBarSearch = {
  /** Every edit of the field's text. */
  onChangeText: (text: string) => void
  /** The field gained or lost focus. */
  onFocusChange?: (focused: boolean) => void
  /** Shown while the field is empty. */
  placeholder: string
  /** Imperative `clear`. */
  ref?: Ref<NavigationBarSearchRef>
  /** Test identifier, forwarded to the native search field. */
  testID?: string
}

export type NavigationBarTitleAlignment = 'center' | 'leading'

/**
 * A title with items on either side, for a header that is not a navigation screen's — `Sheet.Header` is built on it.
 * On iOS a standalone `UINavigationBar`, so the items press and render exactly like a native-stack header's: on iOS 26
 * neighbours share a glass capsule instead of swelling as standalone glass buttons do. On Android Material's top app
 * bar. Where an item goes is the caller's choice — the bar places nothing by itself, so a close can sit on either side.
 * The React Native tier: it needs no host.
 */
export type NavigationBarProps = {
  /** Light items and title, for a bar laid over an image or a dark hero. */
  inverted?: boolean
  /** In screen order, from the leading edge. */
  leadingItems?: NavigationBarItem[]
  /** Replaces the title with a search field (iOS). */
  search?: NavigationBarSearch
  /** Test identifier, forwarded to the native bar. iOS only — Android ignores it. */
  testID?: string
  /** The bar's title. */
  title?: string
  /** `center` by default — iOS's own; `leading` is Material's top app bar. */
  titleAlignment?: NavigationBarTitleAlignment
  /** Fades the title out and in without moving the items — for a large title that scrolls under the bar. */
  titleVisible?: boolean
  /** In screen order, toward the trailing edge. */
  trailingItems?: NavigationBarItem[]
}

export type NavigationBarComponent = (props: NavigationBarProps) => ReactNode
