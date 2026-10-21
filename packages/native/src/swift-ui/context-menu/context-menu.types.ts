import type {ReactNode} from 'react'
import type {StyleProp, ViewStyle} from 'react-native'
import type {SFSymbol} from 'sf-symbols-typescript'

export type ContextMenuItem = {
  destructive?: boolean
  /** Stable identity handed back to `onSelectItem`. */
  id: string
  systemImage?: SFSymbol
  title: string
}

export type ContextMenuProps = {
  /** The always-visible trigger; a long press on it opens the menu. */
  children: ReactNode
  items: ContextMenuItem[]
  /** The user tapped the lifted preview, committing to it. */
  onPreviewPress?: () => void
  onSelectItem?: (id: string) => void
  /** Shown lifted while the menu is open. A snapshot of the trigger when unset. */
  preview?: ReactNode
  style?: StyleProp<ViewStyle>
  testID?: string
}
