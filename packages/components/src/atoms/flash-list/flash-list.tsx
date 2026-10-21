import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {FlashList as ShopifyFlashList} from '@shopify/flash-list'

import type {FlashListProps} from './flash-list.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

/**
 * The default list in this codebase: recycles its rows, so it holds a long list at a steady cost.
 *
 * `RnFlatList` and `RnSectionList` are the alternatives, and only for rows that host native views —
 * see either one for why recycling and absolute positioning cannot carry an `@expo/ui` host.
 */
export const FlashList = <TItem,>({content, data, renderItem, ...props}: FlashListProps<TItem>) => {
  const [style, rest] = useSplitSx(props as Record<string, unknown>)
  const contentStyle = useSx(content ?? NO_SX)

  return (
    <ShopifyFlashList
      data={data}
      renderItem={renderItem}
      {...rest}
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      style={style}
    />
  )
}
