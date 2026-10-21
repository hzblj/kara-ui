import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {type DefaultSectionT, SectionList as RNSectionList} from 'react-native'

import type {RnSectionListProps} from './rn-section-list.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

/**
 * Sectioned list built on React Native's own `VirtualizedList` rather than FlashList.
 *
 * FlashList is the default for lists in this codebase and should stay that way for data rows. This
 * exists for the case it cannot serve: content that hosts native views. FlashList positions its rows
 * absolutely and recycles their cells, and an `@expo/ui` host does not survive either — the hosted
 * view ends up drawn where the layout no longer is. `VirtualizedList` renders its cells in normal flow
 * inside a scroll view, using blank spacers for the range it has not rendered, so a hosted view stays
 * exactly where the layout put it.
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
      sections={sections}
      {...rest}
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      style={style}
    />
  )
}
