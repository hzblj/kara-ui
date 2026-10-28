import {useCallback, useMemo} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import {type SearchVoiceActionEvent, sharedObjectId} from '../../search-voice'
import {type NativeSearchVoiceRecord, toNativeSearchVoice} from '../navigation-item-search/native-search-voice'
import type {NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

type NativeNavigationBarItem = Omit<NavigationBarItem, 'onPress'>

type ItemPressEvent = NativeSyntheticEvent<{index: number; placement: 'leading' | 'trailing'}>

type NativeNavigationBarProps = Omit<
  NavigationBarProps,
  'leadingItems' | 'onSearchFocusChange' | 'onSearchTextChange' | 'searchVoice' | 'trailingItems'
> & {
  leadingItems?: NativeNavigationBarItem[]
  onItemPress: (event: ItemPressEvent) => void
  onSearchFocusChange: (event: NativeSyntheticEvent<{isFocused: boolean}>) => void
  onSearchTextChange: (event: NativeSyntheticEvent<{text: string}>) => void
  onSearchVoiceAction: (event: SearchVoiceActionEvent) => void
  searchVoice: NativeSearchVoiceRecord
  searchVoiceMeter: number | null
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
  searchVoice,
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

  const nativeSearchVoice = useMemo(() => toNativeSearchVoice(searchVoice), [searchVoice])
  const onVoiceStart = searchVoice?.onStart
  const onVoiceStop = searchVoice?.onStop
  const handleSearchVoiceAction = useCallback(
    (event: SearchVoiceActionEvent) => (event.nativeEvent.action === 'start' ? onVoiceStart?.() : onVoiceStop?.()),
    [onVoiceStart, onVoiceStop]
  )

  return (
    <NativeNavigationBar
      {...props}
      leadingItems={nativeLeadingItems}
      onItemPress={handleItemPress}
      onSearchFocusChange={handleSearchFocusChange}
      onSearchTextChange={handleSearchTextChange}
      onSearchVoiceAction={handleSearchVoiceAction}
      searchVoice={nativeSearchVoice}
      searchVoiceMeter={sharedObjectId(searchVoice?.meter)}
      trailingItems={nativeTrailingItems}
    />
  )
}
