import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {DefaultSectionT, SectionListProps as RNSectionListProps} from 'react-native'

/**
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container, so padding and
 * gap belong there — the same split as `RnScrollView` and `RnFlatList`. `removeClippedSubviews` is off unless
 * you turn it on, as in `RnFlatList`: Android's default would leave rows with hosts in them empty.
 */
export type RnSectionListProps<TItem, TSection = DefaultSectionT> = ResponsiveViewSx &
  Omit<RNSectionListProps<TItem, TSection>, 'contentContainerStyle' | 'style'> & {
    /** Styles the scrolling content container — padding and gap belong here. */
    content?: ResponsiveViewSx
  }
