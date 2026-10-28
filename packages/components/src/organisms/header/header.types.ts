import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactElement, ReactNode, RefObject} from 'react'
import type {ColorValue, ImageSourcePropType} from 'react-native'
import type {SharedValue} from 'react-native-reanimated'
import type {SearchBarCommands} from 'react-native-screens'
import type {SFSymbol} from 'sf-symbols-typescript'

import type {IconName} from '../../atoms/icon'
import type {SearchFieldVoice} from '../../molecules/navigation-bar/navigation-bar.types'

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
   * A large title that collapses into the bar as the list scrolls. iOS draws UIKit's own; Android, where the native
   * stack has none, puts it into the content as the list's first row (`largeTitle` in the result) and fades the bar's
   * title in once that row has scrolled away, as Material's large top app bar does. Wire `onScroll` for it.
   */
  largeTitle?: boolean
  /**
   * The leading side's actions, in screen order from the edge. On iOS they follow the back button. Unset leaves the
   * side as the stack's options have it; an empty array clears it.
   */
  leadingActions?: HeaderAction[]
  /**
   * A search field in the header, from `useHeaderSearch`: UIKit's search bar under the title on iOS. Android has no
   * field in its top app bar, so `useHeaderSearch` gives the screen a row of its own to put under it.
   */
  search?: HeaderSearchBarOptions
  /**
   * A line under the title, both on the leading side. iOS 26 sets it as the navigation item's own subtitle, which
   * truncates and morphs between screens natively; elsewhere a title and subtitle are drawn in the bar.
   */
  subtitle?: string
  /** The screen's title, in the bar. */
  title?: string
  /** Keeps the bar without a title, for a screen that draws its own under it. */
  titleHidden?: boolean
  /**
   * Fades the title (and subtitle) in as this goes from 0 to 1, for a detail screen whose title appears once its image
   * has scrolled away. Past half, iOS 26 switches its native title and subtitle on with a cross-dissolve.
   */
  titleRevealProgress?: SharedValue<number>
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
  headerBackground?: () => ReactNode
  headerBackVisible?: boolean
  headerBlurEffect?: 'none' | 'systemChromeMaterial'
  headerLargeTitleEnabled?: boolean
  headerLeft?: (props: HeaderItemProps) => ReactNode
  headerRight?: (props: HeaderItemProps) => ReactNode
  headerSearchBarOptions?: HeaderSearchBarOptions
  headerShown?: boolean
  headerStyle?: {backgroundColor?: string}
  headerTintColor?: string
  headerTitle?: string | (() => ReactNode)
  headerTransparent?: boolean
  scrollEdgeEffects?: {top?: 'automatic' | 'hidden'}
  statusBarStyle?: 'auto' | 'dark' | 'light'
  title?: string
  unstable_headerLeftItems?: (props: HeaderItemProps) => NativeHeaderItem[]
  unstable_headerRightItems?: (props: HeaderItemProps) => NativeHeaderItem[]
}

/** What a list under the header needs from it. */
export type HeaderContent = {
  /**
   * Hand it to the list: `automatic` lets iOS inset the content under its transparent bar, `never` (a hero header)
   * lets the content run under it.
   */
  contentInsetAdjustmentBehavior: 'automatic' | 'never'
  /** Android, with `largeTitle`: the large title, to render as the list's first row. `null` everywhere else. */
  largeTitle: ReactElement | null
  /** A worklet to call with the list's vertical offset from its scroll handler, for what follows the scroll. */
  onScroll: (offsetY: number) => void
}

/** `HeaderContent` plus the options, for a screen that sets them itself (Expo Router's `<Stack.Screen options>`). */
export type HeaderOptionsResult = HeaderContent & {
  options: HeaderOptions
}

/** UIKit's search bar options, as the native stack takes them (`headerSearchBarOptions`). */
export type HeaderSearchBarOptions = {
  allowToolbarIntegration?: boolean
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words'
  hideNavigationBar?: boolean
  hideWhenScrolling?: boolean
  obscureBackground?: boolean
  onBlur?: () => void
  onCancelButtonPress?: () => void
  onChangeText?: (event: {nativeEvent: {text: string}}) => void
  onFocus?: () => void
  placeholder?: string
  placement?: 'automatic' | 'inline' | 'integrated' | 'integratedButton' | 'integratedCentered' | 'stacked'
  ref?: RefObject<SearchBarCommands | null>
  tintColor?: string
}

/**
 * Where the search goes on iOS: `stacked` in a row under the title (title and items kept); `integratedButton` as a
 * search button in the bar's trailing corner that opens the field in the bar, the title and items hidden meanwhile.
 * The integrated field's close is the system's: iOS gives it no other glyph.
 */
export type HeaderSearchPlacement = 'integratedButton' | 'stacked'

export type HeaderSearchParams = {
  /** iOS: the cancel circle beside a focused stacked field (iOS 26), one of the app's icons; the system cross unset. */
  cancelIcon?: IconName
  /** The field's clear button, one of the app's icons; the platform's unset. */
  clearIcon?: IconName
  /** Off leaves the header without a field, for a screen that searches only sometimes. On by default. */
  enabled?: boolean
  /** Shown while the field is empty. `Search` by default. */
  placeholder?: string
  /** iOS: `stacked` by default. Android always puts its field in a row under the bar. */
  placement?: HeaderSearchPlacement
  /** A microphone in the field: see `SearchFieldVoice`. Write what it hears with `setText`. */
  voice?: SearchFieldVoice
}

/**
 * A header's search: what to give `useHeader` (`searchBar`, iOS), the row Android puts under its bar (`searchInput`),
 * the scrim that washes the content out while the field is focused and empty (render it last, over the content), and
 * the query to filter by.
 */
export type HeaderSearch = {
  /** Empties the field and ends the search. */
  clear: () => void
  /** The field's text. */
  query: string
  /**
   * Over the content while the field is focused and empty; a tap on it ends the search. On iOS it also carries the
   * field's glyphs and voice, which have to sit in the screen's tree. Render it last.
   */
  scrim: ReactElement | null
  /** Android: the Material search field, a row to put right under the bar. `null` on iOS. */
  searchInput: ReactElement | null
  /** iOS: `search` for `useHeader`. `undefined` on Android. */
  searchBar: HeaderSearchBarOptions | undefined
  /** Puts text into the field and the query, the way dictation fills it in. */
  setText: (text: string) => void
}

/** Whether the header over a hero is light (over a dark image) or dark (over a light one). */
export type HeroHeaderStyle = 'dark' | 'light'

export type HeroHeaderParams = Pick<HeaderParams, 'backHidden' | 'leadingActions' | 'subtitle' | 'trailingActions'> & {
  /** The hero's height: the header fades in while the part of it under the bar scrolls away. */
  heroHeight: number
  /**
   * Holds the header in its revealed look while above 0, for a hero that opens with an intro (the bar's background, tint
   * and status bar; the title and the trailing actions follow the scroll alone).
   */
  introProgress?: SharedValue<number>
  /** The items and status bar over the hero. `light` (over a dark image) by default. */
  overHeroStyle?: HeroHeaderStyle
  /** Trailing actions that join the bar, in front of `trailingActions`, once the title is revealed. */
  revealedTrailingActions?: HeaderAction[]
  /** The screen's title, revealed in the bar once the hero has scrolled away. */
  title: string
}

/** A hero header: a transparent bar over a full-bleed image that fades in as the image scrolls away. */
export type HeroHeader = HeaderContent & {
  /**
   * The bar's background below iOS 26 and on Android, and the status bar over the hero. Render it after the list.
   */
  background: ReactElement
  /** How far the header has faded in, intro included: 0 over the hero, 1 revealed. */
  progress: SharedValue<number>
  /** The same from the scroll alone, without the intro. */
  scrollProgress: SharedValue<number>
}

/**
 * What `useHeroHeader` needs of a screen's navigation object, React Navigation's and Expo Router's `useNavigation()`
 * both: setting options, and whether the screen is focused, so its status bar applies to it alone.
 */
export type HeroHeaderNavigation = HeaderNavigation & {
  addListener(event: 'blur' | 'focus', callback: () => void): () => void
  isFocused(): boolean
}

/** A native stack's screen options, as React Navigation's native stack and Expo Router's `Stack` both take them. */
export type StackScreenOptions = {
  contentStyle?: {backgroundColor?: string}
  headerBackButtonDisplayMode?: 'default' | 'generic' | 'minimal'
  headerBlurEffect?: 'none' | 'systemChromeMaterial'
  headerLargeTitleEnabled?: boolean
  headerLargeTitleShadowVisible?: boolean
  headerLargeTitleStyle?: {color?: string; fontFamily?: string; fontSize?: number}
  headerShadowVisible?: boolean
  headerShown?: boolean
  headerStyle?: {backgroundColor?: string}
  headerTintColor?: string
  headerTitleStyle?: {color?: string; fontFamily?: string; fontSize?: number}
  headerTransparent?: boolean
  scrollEdgeEffects?: {top?: 'automatic' | 'hidden'}
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
