import type {ReactNode} from 'react'
import type {ColorValue} from 'react-native'

export type TopAppBarTitleAlignment = 'center' | 'leading'

/** The Material back arrow, the close cross, or one of the app's drawables. */
export type TopAppBarItemType = 'back' | 'close' | 'icon'

export type TopAppBarItem = {
  /** A drawable resource name, for `icon`. Use `iconResourceName(name)` for an app icon. */
  iconName?: string
  /** The icon's content description. */
  label: string
  onPress: () => void
  /** Becomes the button's test tag. */
  testID?: string
  type: TopAppBarItemType
}

export type TopAppBarProps = {
  /** `TopAppBar.Search` and nothing else: the field shown over the bar while `searchActive`. */
  children?: ReactNode
  fontFamily?: string
  fontSize?: number
  itemColor: ColorValue
  /** The `navigationIcon` slot, in order. */
  leadingItems?: TopAppBarItem[]
  /**
   * Shows `TopAppBar.Search`: it grows from the trailing edge over the bar, which fades out under it, and shrinks back
   * into that corner when this turns off. The item that turns it on is an ordinary trailing item.
   */
  searchActive?: boolean
  title?: string
  titleAlignment?: TopAppBarTitleAlignment
  titleColor: ColorValue
  /** Fades the title out and back in without moving the items. */
  titleVisible?: boolean
  /** The `actions` slot, in order. */
  trailingItems?: TopAppBarItem[]
}
