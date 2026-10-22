import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'
import type {ScrollViewProps as RNScrollViewProps} from 'react-native'
import type {ScrollViewAxis} from '../scroll-view'

/**
 * React Native tier scroll container — the sibling of `RnView`/`RnText`. Use it when the
 * subtree is React Native and native atoms are embedded through `Island`. For a screen that
 * is native all the way down, reach for the `ScrollView` atom instead.
 *
 * Top-level `sx` styles the viewport; `content` styles the scrolling content container,
 * so padding and gap belong there.
 */
export type RnScrollViewProps = ResponsiveViewSx &
  Omit<RNScrollViewProps, 'contentContainerStyle' | 'horizontal' | 'style'> & {
    /** The scroll direction. `vertical` by default. */
    axis?: ScrollViewAxis
    /** The scrolling content. */
    children?: ReactNode
    /** Styles the scrolling content container — padding and gap belong here. */
    content?: ResponsiveViewSx
    /** Shows the scroll indicators. On by default. */
    showsIndicators?: boolean
  }

export type RnScrollViewComponent = (props: RnScrollViewProps) => ReactNode
