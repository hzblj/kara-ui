import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {FlashListRef, FlashListProps as ShopifyFlashListProps} from '@shopify/flash-list'
import type {Ref} from 'react'

/**
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container — the same split
 * as `RnScrollView` and the React Native lists.
 *
 * Padding belongs in `content` here and nowhere else. FlashList measures its rows against its own
 * `style`, and padding there throws that measurement off; its docs put it as "margin is okay but padding
 * is not". `content` has no such limit, because it lands on the scroll view's content container.
 *
 * `ref` is declared because this is a wrapper rather than the re-export it used to be — React 19 passes
 * it as a plain prop, and a `FlashListRef` is how a caller reaches `scrollToIndex` and friends.
 */
export type FlashListProps<TItem> = ResponsiveViewSx &
  Omit<ShopifyFlashListProps<TItem>, 'contentContainerStyle' | 'style'> & {
    content?: ResponsiveViewSx
    ref?: Ref<FlashListRef<TItem>>
  }
