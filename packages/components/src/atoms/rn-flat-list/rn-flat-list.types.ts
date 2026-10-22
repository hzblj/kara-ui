import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {FlatListProps as RNFlatListProps} from 'react-native'

/**
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container, so padding and
 * gap belong there — the same split as `RnScrollView`. `removeClippedSubviews` is off unless you turn it on:
 * Android's default would detach a row's host before it has measured itself, and the row would stay empty.
 */
export type RnFlatListProps<TItem> = ResponsiveViewSx &
  Omit<RNFlatListProps<TItem>, 'contentContainerStyle' | 'style'> & {
    /** Styles the scrolling content container — padding and gap belong here. */
    content?: ResponsiveViewSx
  }
