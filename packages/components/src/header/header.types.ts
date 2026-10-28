import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactElement, ReactNode, RefObject} from 'react'
import type {ColorValue, ImageSourcePropType} from 'react-native'
import type {SFSymbol} from 'sf-symbols-typescript'

import type {IconName} from '../atoms/icon'

type HeaderActionBase = {
  /**
   * iOS 26: neighbouring actions on one side share a glass capsule; this gives the action its own. A close next to
   * other actions usually wants it. Material has no grouped capsules, so Android ignores it.
   */
  separated?: boolean
  /** iOS: the bar item's `identifier`, which UI tests match; Android: the button's test tag. */
  testID?: string
}

/**
 * The platform's own back or close: a chevron or a cross (an SF Symbol on iOS, a Material Symbol on Android), named
 * `Back` / `Close` for VoiceOver and TalkBack unless given another label. `icon` puts one of the app's icons in their
 * place.
 */
export type HeaderNavigationAction = HeaderActionBase & {
  /** One of the app's icons in place of the platform's glyph. */
  icon?: IconName
  /** What VoiceOver and TalkBack say. `Back` or `Close` by default. */
  label?: string
  /** Called when the action is pressed. */
  onPress: () => void
  type: 'back' | 'close'
}

/** An action drawn as one of the app's icons. */
export type HeaderIconAction = HeaderActionBase & {
  /** iOS 26: a badge on the item, a count or a short text. Android ignores it. */
  badge?: number | string
  /** The icon's colour. The header's own tint by default. */
  color?: ColorToken
  /** Dims the action and stops it responding. */
  disabled?: boolean
  /** One of the app's icons. */
  icon: IconName
  /**
   * What VoiceOver and TalkBack say, since an icon has no words of its own, and the row iOS 26 shows when the items no
   * longer fit and collapse into its overflow menu.
   */
  label: string
  /** Shows a spinner in the action's place while what it started is still running. */
  loading?: boolean
  /** Called when the action is pressed. */
  onPress: () => void
  /** iOS: draws the item in its selected state. Android ignores it. */
  selected?: boolean
  type: 'icon'
}

/** An action drawn as its label: "Edit", "Done". */
export type HeaderTextAction = HeaderActionBase & {
  /** Dims the action and stops it responding. */
  disabled?: boolean
  /** The action's text. */
  label: string
  /** Called when the action is pressed. */
  onPress: () => void
  /** iOS: the prominent style, filled on iOS 26. Android ignores it. */
  prominent?: boolean
  type: 'text'
}

/** One row of a header menu. */
export type HeaderMenuAction = {
  /** iOS: a checkmark before the row, for a menu that picks one of several. Android ignores it. */
  checked?: boolean
  /** iOS: a second line under the label. Android ignores it. */
  description?: string
  /** Draws the row in the destructive colour. */
  destructive?: boolean
  /** Greys the row out and stops it responding. */
  disabled?: boolean
  /** One of the app's icons, beside the label. */
  icon?: IconName
  /** The row's text. */
  label: string
  /** Called when the row is chosen; the menu closes by itself. */
  onPress: () => void
  type: 'action'
}

/**
 * A group of rows: on iOS a nested menu, or with `inline` a section of its parent. Android's dropdown has no nesting,
 * so it lists the group's rows in place.
 */
export type HeaderSubmenu = {
  /** iOS: one of the app's icons beside the group's label. */
  icon?: IconName
  /** iOS: shows the rows as a section of the parent menu instead of behind a row of their own. */
  inline?: boolean
  /** The group's rows, top to bottom. */
  items: HeaderMenuItem[]
  /** The group's label. */
  label: string
  type: 'submenu'
}

export type HeaderMenuItem = HeaderMenuAction | HeaderSubmenu

/** An icon that opens a menu: a `UIMenu` from the bar item on iOS, a Material dropdown under it on Android. */
export type HeaderMenu = HeaderActionBase & {
  /** One of the app's icons on the item. */
  icon: IconName
  /** The menu's rows, top to bottom. */
  items: HeaderMenuItem[]
  /** What VoiceOver and TalkBack say for the item: "More options". */
  label: string
  /** iOS: a title above the rows. Android ignores it. */
  title?: string
  type: 'menu'
}

/** Any React Native element in the header, for what the other actions cannot draw: an avatar, a count. */
export type HeaderCustomAction = {
  /** The element, laid out at its own size. */
  element: ReactElement
  /** Identifies the element among the side's actions. */
  key: string
  /** iOS 26: keeps the element apart from its neighbours' shared glass. Android ignores it. */
  separated?: boolean
  type: 'custom'
}

/**
 * One action of a screen's header. iOS draws them as the navigation bar's own `UIBarButtonItem`s (the same glass,
 * press and overflow menu as the system's), Android as Material icon and text buttons in the top app bar.
 */
export type HeaderAction =
  | HeaderCustomAction
  | HeaderIconAction
  | HeaderMenu
  | HeaderNavigationAction
  | HeaderTextAction

export type HeaderParams = {
  /**
   * Hides the stack's own back button. On Android a trailing `close` then takes the navigation icon's place at the
   * start, as Material's full-screen dialogs have it, unless there are leading actions.
   */
  backHidden?: boolean
  /**
   * The leading side's actions, in screen order from the edge. On iOS they follow the back button. Unset leaves the
   * side as the stack's options have it; an empty array clears it.
   */
  leadingActions?: HeaderAction[]
  /**
   * The trailing side's actions, in screen order toward the edge: the close usually last. Unset leaves the side as the
   * stack's options have it; an empty array clears it.
   */
  trailingActions?: HeaderAction[]
}

type NativeHeaderItemIcon = {name: SFSymbol; type: 'sfSymbol'} | {source: ImageSourcePropType; type: 'image'}

type NativeHeaderItemShared = {
  accessibilityLabel?: string
  badge?: {value: number | string}
  disabled?: boolean
  icon?: NativeHeaderItemIcon
  identifier?: string
  label: string
  sharesBackground?: boolean
  tintColor?: ColorValue
  variant?: 'done' | 'plain' | 'prominent'
}

export type NativeHeaderMenuElement =
  | {
      description?: string
      destructive?: boolean
      disabled?: boolean
      icon?: NativeHeaderItemIcon
      label: string
      onPress: () => void
      state?: 'mixed' | 'off' | 'on'
      type: 'action'
    }
  | {icon?: NativeHeaderItemIcon; inline?: boolean; items: NativeHeaderMenuElement[]; label: string; type: 'submenu'}

/** A native-stack header item, the shape React Navigation's and Expo Router's native stacks both take. */
export type NativeHeaderItem =
  | (NativeHeaderItemShared & {menu: {items: NativeHeaderMenuElement[]; title?: string}; type: 'menu'})
  | (NativeHeaderItemShared & {onPress: () => void; selected?: boolean; type: 'button'})
  | {element: ReactElement; hidesSharedBackground?: boolean; type: 'custom'}
  | {spacing: number; type: 'spacing'}

export type HeaderItemProps = {
  /** Whether the stack can go back from this screen. */
  canGoBack?: boolean
  /** The header's tint. */
  tintColor?: ColorValue
}

/**
 * Native-stack screen options, as React Navigation's native stack and Expo Router's `Stack` both take them: spread them
 * into `options`, or hand them to `navigation.setOptions`.
 */
export type HeaderOptions = {
  headerBackVisible?: boolean
  headerLeft?: (props: HeaderItemProps) => ReactNode
  headerRight?: (props: HeaderItemProps) => ReactNode
  unstable_headerLeftItems?: (props: HeaderItemProps) => NativeHeaderItem[]
  unstable_headerRightItems?: (props: HeaderItemProps) => NativeHeaderItem[]
}

/** A native stack's screen options, as React Navigation's native stack and Expo Router's `Stack` both take them. */
export type StackScreenOptions = {
  contentStyle?: {backgroundColor?: string}
  headerBackButtonDisplayMode?: 'default' | 'generic' | 'minimal'
  headerBlurEffect?: 'systemChromeMaterial'
  headerLargeTitleEnabled?: boolean
  headerLargeTitleShadowVisible?: boolean
  headerLargeTitleStyle?: {color?: string; fontFamily?: string; fontSize?: number}
  headerShadowVisible?: boolean
  headerShown?: boolean
  headerStyle?: {backgroundColor?: string}
  headerTintColor?: string
  headerTitleStyle?: {color?: string; fontFamily?: string; fontSize?: number}
  headerTransparent?: boolean
}

/** What `useHeader` needs of a screen's navigation object: React Navigation's and Expo Router's `useNavigation()` both. */
export type HeaderNavigation = {
  setOptions(options: HeaderOptions): void
}

/** Something a list can scroll with: a `ScrollView`, a `FlatList`, a `FlashList` or a `LegendList`. */
export type HeaderScrollable =
  | {getScrollResponder: () => {scrollTo: (options: {animated?: boolean; y?: number}) => void} | null | undefined}
  | {scrollTo: (options: {animated?: boolean; y?: number}) => void}
  | {scrollToOffset: (params: {animated?: boolean; offset: number}) => void}

export type HeaderScrollToTopOptions = {
  /** Whether the screen has a large title, which the top includes on iOS. */
  largeTitle?: boolean
  /** Extra room above the content, for a bar the screen lays out under the header itself. */
  topInset?: number
}

/** What React Navigation's and Expo Router's `useScrollToTop` call when its tab is pressed again. */
export type HeaderScrollToTopRef = RefObject<{scrollToTop: () => void}>

export type HeaderInsetProps = {
  /** The content that starts right under the header. */
  children?: ReactNode
}

export type HeaderInsetComponent = (props: HeaderInsetProps) => ReactNode
