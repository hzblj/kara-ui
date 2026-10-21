import {Column, Text as ComposeText, DropdownMenu} from '@expo/ui/jetpack-compose'
import {clickable, combinedClickable} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useState} from 'react'

import {useHostGuard} from '../../host-context'
import type {MenuAction} from '../menu'
import type {ContextMenuComponent, ContextMenuProps} from './context-menu.types'

type MenuItemProps = {
  action: MenuAction
  onDismiss: () => void
}

/** A row's `clickable` closes over its own action, so memoising it needs a component per row. */
const MenuItem = ({action, onDismiss}: MenuItemProps) => {
  const theme = useAppTheme()
  const modifiers = useMemo(
    () => [
      clickable(() => {
        onDismiss()
        action.onPress()
      }),
    ],
    [action, onDismiss]
  )

  return (
    <ComposeText
      color={theme.colorString(action.destructive ? 'content.destructive' : 'content.primary')}
      modifiers={modifiers}
      style={theme.typography.body}
    >
      {action.label}
    </ComposeText>
  )
}

export const ContextMenu: ContextMenuComponent = ({actions, children}: ContextMenuProps) => {
  useHostGuard('ContextMenu')

  const [expanded, setExpanded] = useState(false)
  const dismiss = useCallback(() => setExpanded(false), [])
  const triggerModifiers = useMemo(() => [combinedClickable({onLongClick: () => setExpanded(true)})], [])

  return (
    <Column>
      <Column modifiers={triggerModifiers}>{children}</Column>
      <DropdownMenu expanded={expanded} onDismissRequest={dismiss}>
        {actions.map(action => (
          <MenuItem action={action} key={action.label} onDismiss={dismiss} />
        ))}
      </DropdownMenu>
    </Column>
  )
}
