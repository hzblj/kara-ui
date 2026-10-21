import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {FlatListProps as RNFlatListProps} from 'react-native'

/**
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container, so padding and
 * gap belong there — the same split as `RnScrollView`.
 */
export type RnFlatListProps<TItem> = ResponsiveViewSx &
  Omit<RNFlatListProps<TItem>, 'contentContainerStyle' | 'style'> & {
    content?: ResponsiveViewSx
  }
