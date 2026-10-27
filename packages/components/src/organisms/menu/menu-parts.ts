import type {ColorToken} from '@hzblj/kara-theme'

import type {IconName} from '../../atoms/icon'
import type {MenuAction, MenuProps} from './menu.types'

/**
 * An action's colour in a row kara draws itself (the Android menus and sheets): greyed when disabled, as `IconButton`
 * greys, red when destructive. A Compose `DropdownMenuItem` cannot grey its own text here, since the text sets its
 * colour explicitly.
 */
export const menuActionColor = ({destructive, disabled}: MenuAction): ColorToken => {
  if (disabled) {
    return 'btn.content.disabled'
  }

  return destructive ? 'content.destructive' : 'content.primary'
}

/** A trigger with no text: the props' union guarantees its icon and the words a screen reader says for it. */
export const isIconOnly = (props: MenuProps): props is MenuProps & {accessibilityLabel: string; icon: IconName} =>
  props.label === undefined
