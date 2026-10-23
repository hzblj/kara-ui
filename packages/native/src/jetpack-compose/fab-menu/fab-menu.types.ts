import type {ReactNode} from 'react'
import type {ColorValue} from 'react-native'

export type FloatingActionButtonMenuHorizontalAlignment = 'center' | 'end' | 'start'

export type FloatingActionButtonMenuProps = {
  /**
   * One `<FloatingActionButtonMenu.Button>` holding the trigger (usually a `ToggleFloatingActionButton`) and any
   * number of `<FloatingActionButtonMenuItem>`s.
   */
  children: ReactNode
  expanded: boolean
  /** Where the items align relative to the trigger. Defaults to `end`. */
  horizontalAlignment?: FloatingActionButtonMenuHorizontalAlignment
}

export type FloatingActionButtonMenuItemProps = {
  /** `<FloatingActionButtonMenuItem.Icon>` and `<FloatingActionButtonMenuItem.Text>`. */
  children?: ReactNode
  /** The item pill. The Material 3 Expressive default when unset. */
  containerColor?: ColorValue
  /** Icon and label. The Material 3 Expressive default when unset. */
  contentColor?: ColorValue
  onClick?: () => void
}

export type ToggleFloatingActionButtonProps = {
  checked: boolean
  /** `<ToggleFloatingActionButton.Icon>`, which turns 45° as the button checks. */
  children?: ReactNode
  containerColor?: ColorValue
  onCheckedChange: (checked: boolean) => void
}
