import {useCallback, useMemo} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

type NativeNavigationBarItem = Omit<NavigationBarItem, 'onPress'>

type ItemPressEvent = NativeSyntheticEvent<{index: number; placement: 'leading' | 'trailing'}>

type NativeNavigationBarProps = Omit<
  NavigationBarProps,
  'leadingItems' | 'onSearchFocusChange' | 'onSearchTextChange' | 'trailingItems'
> & {
  leadingItems?: NativeNavigationBarItem[]
  onItemPress: (event: ItemPressEvent) => void
  onSearchFocusChange: (event: NativeSyntheticEvent<{isFocused: boolean}>) => void
  onSearchTextChange: (event: NativeSyntheticEvent<{text: string}>) => void
  trailingItems?: NativeNavigationBarItem[]
}

const NativeNavigationBar = requireKaraView<NativeNavigationBarProps>('NavigationBarView')

/** What crosses the bridge: everything but the handler, which stays here and is found again by index. */
const toNativeItem = ({imageName, label, separated, testID, type}: NavigationBarItem): NativeNavigationBarItem => ({
  imageName,
  label,
  separated,
  testID,
  type,
})

/**
 * A standalone `UINavigationBar` whose items press and render like a native-stack header's, on either side and in any
 * order. On iOS 26 neighbouring items share a glass capsule; `separated` gives one its own.
 */
export const NavigationBar = ({
  leadingItems,
  onSearchFocusChange,
  onSearchTextChange,
  trailingItems,
  ...props
}: NavigationBarProps) => {
  const nativeLeadingItems = useMemo(() => leadingItems?.map(toNativeItem), [leadingItems])
  const nativeTrailingItems = useMemo(() => trailingItems?.map(toNativeItem), [trailingItems])

  const handleItemPress = useCallback(
    (event: ItemPressEvent) => {
      const {index, placement} = event.nativeEvent
      const items = placement === 'leading' ? leadingItems : trailingItems
      items?.[index]?.onPress()
    },
    [leadingItems, trailingItems]
  )

  const handleSearchTextChange = useCallback(
    (event: NativeSyntheticEvent<{text: string}>) => onSearchTextChange?.(event.nativeEvent.text),
    [onSearchTextChange]
  )

  const handleSearchFocusChange = useCallback(
    (event: NativeSyntheticEvent<{isFocused: boolean}>) => onSearchFocusChange?.(event.nativeEvent.isFocused),
    [onSearchFocusChange]
  )

  return (
    <NativeNavigationBar
      {...props}
      leadingItems={nativeLeadingItems}
      onItemPress={handleItemPress}
      onSearchFocusChange={handleSearchFocusChange}
      onSearchTextChange={handleSearchTextChange}
      trailingItems={nativeTrailingItems}
    />
  )
}
