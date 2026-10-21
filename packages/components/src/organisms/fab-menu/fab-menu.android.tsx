import {Text as ComposeText} from '@expo/ui/jetpack-compose'
import {
  FloatingActionButtonMenu,
  FloatingActionButtonMenuItem,
  ToggleFloatingActionButton,
} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useState} from 'react'
import {Icon} from '../../atoms/icon'
import {useHostGuard} from '../../host-context'
import type {MenuAction} from '../menu'
import type {FabMenuComponent, FabMenuProps} from './fab-menu.types'

type FabMenuRowProps = {
  action: MenuAction
  onSelect: (action: MenuAction) => void
}

/** A row's `onClick` closes over its own action, so memoising it needs a component per row. */
const FabMenuRow = ({action, onSelect}: FabMenuRowProps) => {
  const theme = useAppTheme()
  const onClick = useCallback(() => onSelect(action), [action, onSelect])

  return (
    <FloatingActionButtonMenuItem
      containerColor={theme.color('fill.accent.primary')}
      contentColor={theme.color('content.on.bg')}
      onClick={onClick}
    >
      {action.icon ? (
        <FloatingActionButtonMenuItem.Icon>
          <Icon color="content.on.bg" name={action.icon} />
        </FloatingActionButtonMenuItem.Icon>
      ) : null}
      <FloatingActionButtonMenuItem.Text>
        <ComposeText color={theme.colorString('content.on.bg')} style={theme.typography.labelMedium}>
          {action.label}
        </ComposeText>
      </FloatingActionButtonMenuItem.Text>
    </FloatingActionButtonMenuItem>
  )
}

/**
 * The menu fills its host and pins itself to the bottom end, so give it the corner of a screen — a `ZStack` over the
 * content — rather than a row of its own. The pills take the button's colours, so the menu reads as the button
 * unfolding rather than a second surface.
 */
export const FabMenu: FabMenuComponent = ({actions, icon = 'add'}: FabMenuProps) => {
  useHostGuard('FabMenu')

  const theme = useAppTheme()
  const [expanded, setExpanded] = useState(false)

  const onSelect = useCallback((action: MenuAction) => {
    setExpanded(false)
    action.onPress()
  }, [])

  return (
    <FloatingActionButtonMenu expanded={expanded} horizontalAlignment="end">
      <FloatingActionButtonMenu.Button>
        <ToggleFloatingActionButton
          checked={expanded}
          containerColor={theme.color('fill.accent.primary')}
          onCheckedChange={setExpanded}
        >
          <ToggleFloatingActionButton.Icon>
            <Icon color="content.on.bg" name={icon} />
          </ToggleFloatingActionButton.Icon>
        </ToggleFloatingActionButton>
      </FloatingActionButtonMenu.Button>
      {actions.map(action => (
        <FabMenuRow action={action} key={action.label} onSelect={onSelect} />
      ))}
    </FloatingActionButtonMenu>
  )
}
