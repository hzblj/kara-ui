import {useCallback, useMemo} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {TopAppBarItem, TopAppBarProps} from './top-app-bar.types'

type NativeTopAppBarItem = Omit<TopAppBarItem, 'onPress'>

type ItemPressEvent = NativeSyntheticEvent<{index: number; placement: 'leading' | 'trailing'}>

type NativeTopAppBarProps = Omit<TopAppBarProps, 'leadingItems' | 'trailingItems'> & {
  leadingItems?: NativeTopAppBarItem[]
  onItemPress: (event: ItemPressEvent) => void
  trailingItems?: NativeTopAppBarItem[]
}

const NativeTopAppBar = requireKaraView<NativeTopAppBarProps>('TopAppBarView')

/** What crosses the bridge: everything but the handler, which stays here and is found again by index. */
const toNativeItem = ({iconName, label, testID, type}: TopAppBarItem): NativeTopAppBarItem => ({
  iconName,
  label,
  testID,
  type,
})

/**
 * Material's top app bar on a transparent container — centred or leading title, items in the `navigationIcon` and
 * `actions` slots in the order given. A Compose view: it renders inside a host.
 */
export const TopAppBar = ({leadingItems, trailingItems, ...props}: TopAppBarProps) => {
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

  return (
    <NativeTopAppBar
      {...props}
      leadingItems={nativeLeadingItems}
      onItemPress={handleItemPress}
      trailingItems={nativeTrailingItems}
    />
  )
}
