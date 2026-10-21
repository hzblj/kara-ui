import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * A swipeable, snapping pager: SwiftUI's `TabView` in its page style, Compose's `HorizontalPager`.
 *
 * Pages are addressed by their index rather than by a name, because Compose's pager is index-native
 * and SwiftUI's tab values are strings — synthesising the string from the child's position is
 * lossless, whereas inventing indices for named tabs on Compose would not be. Children are therefore
 * plain nodes with no `Pager.Page` part to wrap them in: a page carries no props of its own, so the
 * ceremony would buy nothing.
 */
export type PagerProps = {
  children?: ReactNode
  /**
   * Page dots. iOS draws SwiftUI's own, over the bottom edge; Compose has no built-in indicator, so
   * Android composes the dots and places them below the pager, which is where Material puts them.
   */
  indicators?: boolean
  /** Fires once a swipe or a programmatic move has settled, never mid-gesture. */
  onPageChange?: (page: number) => void
  /** Zero-based. Controlled when passed; otherwise the pager just starts at 0 and owns its position. */
  page?: number
  /** Android only — a SwiftUI page-style `TabView` has no gap between pages. */
  pageSpacing?: SpaceSize
  /**
   * Android only. SwiftUI can only disable a `TabView` as a whole, which would take the pages'
   * content down with the swipe, so iOS always stays swipeable.
   */
  scrollEnabled?: boolean
  testID?: string
}

export type PagerComponent = (props: PagerProps) => ReactNode
