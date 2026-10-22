import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {type DefaultSectionT, SectionList as RNSectionList} from 'react-native'

import type {RnSectionListProps} from './rn-section-list.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

/**
 * `RnFlatList` with sections: React Native's own `VirtualizedList`, cells in normal flow inside a scroll view, so a
 * row that hosts native views keeps them where the layout put it.
 *
 * Sticky headers default off, unlike React Native, where they are on for vertical lists. A header that
 * detaches and floats over the content is a deliberate effect, not something a list should do unasked.
 */
export const RnSectionList = <TItem, TSection = DefaultSectionT>({
  content,
  sections,
  stickySectionHeadersEnabled = false,
  ...props
}: RnSectionListProps<TItem, TSection>) => {
  const [style, rest] = useSplitSx(props as Record<string, unknown>)
  const contentStyle = useSx(content ?? NO_SX)

  return (
    <RNSectionList<TItem, TSection>
      // Android clips by default, and a host is measured after its first layout — at zero height it counts as
      // off-screen, is detached, and its native view never comes back.
      removeClippedSubviews={false}
      sections={sections}
      {...rest}
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      style={style}
    />
  )
}
