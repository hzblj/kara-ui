import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {FlatList as RNFlatList} from 'react-native'

import type {RnFlatListProps} from './rn-flat-list.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

/**
 * Flat list built on React Native's own `VirtualizedList` rather than FlashList.
 *
 * FlashList is the default for lists in this codebase and should stay that way for data rows — reach
 * for this only for the case it cannot serve: content that hosts native views. FlashList positions its
 * rows absolutely and recycles their cells, and an `@expo/ui` host survives neither — the hosted view
 * ends up drawn where the layout no longer is. `VirtualizedList` renders its cells in normal flow
 * inside a scroll view, using blank spacers for the range it has not rendered, so a hosted view stays
 * exactly where the layout put it. This is `SectionList`'s reason to exist too, without the sections.
 */
export const RnFlatList = <TItem,>({content, data, renderItem, ...props}: RnFlatListProps<TItem>) => {
  const [style, rest] = useSplitSx(props as Record<string, unknown>)
  const contentStyle = useSx(content ?? NO_SX)

  return (
    <RNFlatList<TItem>
      data={data}
      renderItem={renderItem}
      {...rest}
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      style={style}
    />
  )
}
