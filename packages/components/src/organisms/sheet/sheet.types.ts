import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactElement, ReactNode, Ref} from 'react'
import type {NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps} from 'react-native'
import type {NavigationBarItem, NavigationBarSearch} from '../../molecules/navigation-bar'

/** `auto` fits the content; a number is a fraction of the screen's height. */
export type SheetDetent = 'auto' | number

/**
 * `center` is iOS's own, `leading` Material's. `large` puts the title above the content in a large face, and once
 * that scrolls under the bar the bar's own title fades in — centred on iOS, leading on Android.
 */
export type SheetTitleStyle = 'center' | 'large' | 'leading'

/**
 * The sheet's header: a `NavigationBar` with the title and items, and anything else that should stay put above the
 * content (`children` — a segmented control, a search hint). On iOS 26 a scrollable sheet's content scrolls under it
 * with the system's scroll edge effect; elsewhere it sits above the content.
 */
export type SheetHeaderProps = {
  /** Pinned under the bar. */
  children?: ReactNode
  /** Light items and title, for a sheet with a dark or image background. */
  inverted?: boolean
  /** In screen order, from the leading edge. */
  leadingItems?: NavigationBarItem[]
  /** A search field in place of the title (iOS). */
  search?: NavigationBarSearch
  /** The title — in the bar, or above the content with a `large` `titleStyle`. */
  title?: string
  /** `center` by default. */
  titleStyle?: SheetTitleStyle
  /** In screen order, toward the trailing edge — the close item, by convention. */
  trailingItems?: NavigationBarItem[]
}

/** Imperative control of a `Sheet`, through its `ref`. */
export type SheetRef = {
  /** Dismisses it without calling `onDismiss`, which reports the user's dismissals only. */
  dismiss: () => Promise<void>
  /** Presents at a detent — the first by default. */
  present: (detentIndex?: number) => Promise<void>
  /** Moves to another detent. */
  resize: (detentIndex: number) => Promise<void>
}

/**
 * A native sheet — `UISheetPresentationController` on iOS, Material's bottom sheet on Android — with an optional
 * native header (`<Sheet.Header>` as a direct child). The React Native tier: it needs no host, and must not sit inside
 * one; native atoms in its content go in an `Island`.
 */
export type SheetProps = {
  /** The sheet's colour. `surface.primary` by default. */
  bg?: ColorToken
  /** The content. A `<Sheet.Header>` among the direct children becomes the native header instead. */
  children: ReactNode
  /** Where the sheet can rest, smallest first. `['auto']` — fit the content — by default. */
  detents?: SheetDetent[]
  /** Dims what is behind. On by default. */
  dimmed?: boolean
  /** A swipe down or a tap outside closes it. On by default. */
  dismissible?: boolean
  /** It follows the finger between detents. On by default. */
  draggable?: boolean
  /** Pinned to the bottom, above the content and the keyboard. */
  footer?: ReactElement
  /** The drag handle. On by default. */
  grabber?: boolean
  /** The user dismissed it — `visible` going false does not call this. */
  onDismiss: () => void
  /** The sheet moved to another detent — its index in `detents`. */
  onDetentChange?: (detentIndex: number) => void
  /** The sheet finished presenting. */
  onPresent?: () => void
  /** `present`, `dismiss` and `resize`, for driving the sheet imperatively. */
  ref?: Ref<SheetRef>
  /**
   * The content is a scroll view (`<Sheet.ScrollView>`) the sheet drives: dragging past its top resizes the sheet,
   * and a header scrolls with the iOS 26 edge effect. Off by default — set it with a scrolling body.
   */
  scrollable?: boolean
  /** Test identifier, forwarded to the native sheet. */
  testID?: string
  /** Presents the sheet while true; going false dismisses it. */
  visible: boolean
}

export type SheetScrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => void

/** What a scroll view inside a sheet needs: the room the header takes, the large title, the scroll listener. */
export type SheetScrollContextValue = {
  /** Render it first in the content. `null` unless the header's `titleStyle` is `large`. */
  largeTitle: ReactNode
  /** Forward the scroll view's scroll events to it — it tracks the large title. Unset when there is none. */
  onScroll?: SheetScrollHandler
  /** The room an overlaid header takes, to add to the content's top padding. `0` where the header sits above it. */
  topInset: number
}

/**
 * The body of a `scrollable` sheet: its content starts below an overlaid header, it carries a large title, and it
 * reports its scroll to the sheet.
 */
export type SheetScrollViewProps = Pick<ScrollViewProps, 'keyboardShouldPersistTaps'> & {
  /** The scrolling content, after the large title if there is one. */
  children: ReactNode
  /** Styles the scrolling content — padding and gap belong here, as with `RnScrollView`. */
  content?: ResponsiveViewSx
  /** Called on every scroll event, after the sheet's own listener. */
  onScroll?: SheetScrollHandler
  /** Test identifier, forwarded to the scroll view. */
  testID?: string
}

export type SheetComponent = ((props: SheetProps) => ReactNode) & {
  Header: (props: SheetHeaderProps) => ReactNode
  ScrollView: (props: SheetScrollViewProps) => ReactNode
}
