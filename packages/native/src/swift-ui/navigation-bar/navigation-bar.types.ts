import type {Ref} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type NavigationBarTitleAlignment = 'center' | 'leading'

/** The back chevron, the system close item, or an image from the app's asset catalog with a title for VoiceOver. */
export type NavigationBarItemType = 'back' | 'close' | 'icon'

export type NavigationBarItem = {
  /** An asset-catalog image, drawn as a template. `back` falls back to `chevron.backward`; `close` ignores it. */
  imageName?: string
  /** The accessibility label — and, for `icon`, the title the system shows when it has room for one. */
  label: string
  onPress: () => void
  /** iOS 26: gives the item its own glass capsule instead of sharing one with its neighbours on that side. */
  separated?: boolean
  /** Becomes the item's `accessibilityIdentifier`. */
  testID?: string
  type: NavigationBarItemType
}

export type NavigationBarRef = {
  /** Empties the search field and ends editing. */
  clearSearchText: () => Promise<void>
}

export type NavigationBarProps = {
  fontFamily?: string
  fontSize?: number
  itemColor: ColorValue
  /** In screen order, from the leading edge. */
  leadingItems?: NavigationBarItem[]
  onSearchFocusChange?: (focused: boolean) => void
  onSearchTextChange?: (text: string) => void
  ref?: Ref<NavigationBarRef>
  /** Replaces the title with a `UISearchBar` showing this placeholder. */
  searchPlaceholder?: string
  /** Becomes the search field's `accessibilityIdentifier`. */
  searchTestID?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  title?: string
  titleAlignment?: NavigationBarTitleAlignment
  titleColor: ColorValue
  /** Fades the title out and back in without moving the items — for a large title that scrolls under the bar. */
  titleVisible?: boolean
  /** In screen order, toward the trailing edge. */
  trailingItems?: NavigationBarItem[]
}
