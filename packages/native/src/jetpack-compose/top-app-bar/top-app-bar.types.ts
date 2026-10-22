import type {ColorValue} from 'react-native'

export type TopAppBarTitleAlignment = 'center' | 'leading'

/** The Material back arrow, the close cross, or one of the app's drawables. */
export type TopAppBarItemType = 'back' | 'close' | 'icon'

export type TopAppBarItem = {
  /** A drawable resource name, for `icon` — `iconResourceName(name)` for an app icon. */
  iconName?: string
  /** The icon's content description. */
  label: string
  onPress: () => void
  /** Becomes the button's test tag. */
  testID?: string
  type: TopAppBarItemType
}

export type TopAppBarProps = {
  fontFamily?: string
  fontSize?: number
  itemColor: ColorValue
  /** The `navigationIcon` slot, in order. */
  leadingItems?: TopAppBarItem[]
  title?: string
  titleAlignment?: TopAppBarTitleAlignment
  titleColor: ColorValue
  /** Fades the title out and back in without moving the items. */
  titleVisible?: boolean
  /** The `actions` slot, in order. */
  trailingItems?: TopAppBarItem[]
}
