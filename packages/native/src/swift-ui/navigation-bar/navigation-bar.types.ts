import type {Ref} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import type {SearchFieldVoiceIOS} from '../navigation-item-search/navigation-item-search.types'

export type NavigationBarTitleAlignment = 'center' | 'leading'

/**
 * Where the search field goes, as a native-stack header places its search controller: `stacked` in a row of its own
 * under the title; `integratedButton` as a search item beside the trailing items that turns the whole bar into the
 * field while searching.
 */
export type NavigationBarSearchPlacement = 'integratedButton' | 'stacked'

/** The back chevron, the system close item, or an image from the app's asset catalog with a title for VoiceOver. */
export type NavigationBarItemType = 'back' | 'close' | 'icon'

export type NavigationBarItem = {
  /** An asset-catalog image, drawn as a template. `back` falls back to `chevron.backward`, `close` to the system item. */
  imageName?: string
  /** The accessibility label and, for `icon`, the title the system shows when it has room for one. */
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
  /** Sets the search field's text without a change event, the way dictation fills it in. */
  setSearchText: (text: string) => Promise<void>
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
  /** `integratedButton`: an asset-catalog image for the search item, drawn as a template; `magnifyingglass` unset. */
  searchButtonImageName?: string
  /** `integratedButton`: the search item's accessibility label. */
  searchButtonLabel?: string
  /** An asset-catalog image for the cancel item a focused field gets, drawn as a template; `xmark` unset. */
  searchCancelImageName?: string
  /** The cancel item's accessibility label. */
  searchCancelLabel?: string
  /** The field's own clear button, without `searchVoice`: an asset-catalog image, drawn in the secondary label colour. */
  searchClearImageName?: string
  /** Adds a `UISearchBar` showing this placeholder, placed by `searchPlacement`. */
  searchPlaceholder?: string
  /** `stacked` by default. */
  searchPlacement?: NavigationBarSearchPlacement
  /** Becomes the search field's `accessibilityIdentifier`. */
  searchTestID?: string
  /** A microphone in the search field, a live waveform and a stop button while listening. */
  searchVoice?: SearchFieldVoiceIOS
  style?: StyleProp<ViewStyle>
  testID?: string
  title?: string
  titleAlignment?: NavigationBarTitleAlignment
  titleColor: ColorValue
  /** Fades the title out and back in without moving the items, for a large title that scrolls under the bar. */
  titleVisible?: boolean
  /** In screen order, toward the trailing edge. */
  trailingItems?: NavigationBarItem[]
}
