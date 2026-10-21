import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {DefaultSectionT, SectionListProps as RNSectionListProps} from 'react-native'

/**
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container, so padding and
 * gap belong there — the same split as `RnScrollView` and `RnFlatList`.
 */
export type RnSectionListProps<TItem, TSection = DefaultSectionT> = ResponsiveViewSx &
  Omit<RNSectionListProps<TItem, TSection>, 'contentContainerStyle' | 'style'> & {
    content?: ResponsiveViewSx
  }
