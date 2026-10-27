import type {ReactNode} from 'react'
import type {StyleProp, ViewStyle} from 'react-native'
import type {SFSymbol} from 'sf-symbols-typescript'

export type ContextMenuItem = {
  destructive?: boolean
  /** Stable identity handed back to `onSelectItem`. */
  id: string
  /** An image in the app's asset catalog: an app icon (`native_icon_*`, `@hzblj/expo-native-icons`). Wins over `systemImage`. */
  image?: string
  systemImage?: SFSymbol
  title: string
}

/**
 * How a tapped preview leaves before `onPreviewPress`. `zoom`: its photo grows straight into the pushed screen (iOS 18,
 * with a `ZoomTransitionSource` in the trigger; otherwise as `dismiss`). `pop`: UIKit's default, the preview flies
 * out. `dismiss`: it shrinks back onto the trigger first.
 */
export type ContextMenuPreviewTransition = 'dismiss' | 'pop' | 'zoom'

export type ContextMenuProps = {
  /** The always-visible trigger; a long press on it opens the menu. */
  children: ReactNode
  items: ContextMenuItem[]
  /** The menu ended; `isCommitted` when a tap on the preview ended it. */
  onMenuClose?: (isCommitted: boolean) => void
  /** The menu appeared. */
  onMenuOpen?: () => void
  /** The user tapped the lifted preview, committing to it. */
  onPreviewPress?: () => void
  onSelectItem?: (id: string) => void
  /**
   * The react-native-screens `screenId` (the route key) of a screen preloaded in the enclosing native stack. A tapped
   * preview then pushes it natively at once and, with `zoom`, morphs as a whole into it.
   */
  preloadedScreenId?: string
  /** Shown lifted while the menu is open. A snapshot of the trigger when unset. */
  preview?: ReactNode
  /** Default: `zoom` when the trigger holds a `ZoomTransitionSource`, `pop` otherwise. */
  previewTransition?: ContextMenuPreviewTransition
  style?: StyleProp<ViewStyle>
  testID?: string
}
