import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {FlatList as RNFlatList} from 'react-native'

import type {RnFlatListProps} from './rn-flat-list.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

/**
 * kara's list for React Native content: React Native's own `VirtualizedList`, styled through `sx`. It renders its
 * cells in normal flow inside a scroll view, with blank spacers for the range it has not rendered, so a row that hosts
 * native views keeps them where the layout put it. A recycling list (absolutely positioned, reused cells) cannot
 * promise that — an `@expo/ui` host survives neither, and draws where the layout no longer is — which is why kara
 * ships none.
 */
export const RnFlatList = <TItem,>({content, data, renderItem, ...props}: RnFlatListProps<TItem>) => {
  const [style, rest] = useSplitSx(props as Record<string, unknown>)
  const contentStyle = useSx(content ?? NO_SX)

  return (
    <RNFlatList<TItem>
      data={data}
      // Android clips by default, and a host is measured after its first layout — at zero height it counts as
      // off-screen, is detached, and its native view never comes back.
      removeClippedSubviews={false}
      renderItem={renderItem}
      {...rest}
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      style={style}
    />
  )
}
