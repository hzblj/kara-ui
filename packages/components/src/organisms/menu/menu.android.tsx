import {Text as ComposeText, DropdownMenu, DropdownMenuItem} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useState} from 'react'
import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Text} from '../../atoms/text'
import {Glyph} from '../../glyph'
import {useHostGuard} from '../../host-context'
import type {MenuAction, MenuComponent, MenuProps} from './menu.types'

type MenuItemProps = {
  action: MenuAction
  onDismiss: () => void
}

const MenuItem = ({action, onDismiss}: MenuItemProps) => {
  const theme = useAppTheme()
  const color = action.destructive ? 'content.destructive' : 'content.primary'

  return (
    <DropdownMenuItem
      elementColors={{leadingIconColor: theme.color(color), textColor: theme.color(color)}}
      onClick={() => {
        onDismiss()
        action.onPress()
      }}
    >
      <DropdownMenuItem.Text>
        <ComposeText color={theme.colorString(color)} style={theme.typography.body}>
          {action.label}
        </ComposeText>
      </DropdownMenuItem.Text>
      {action.icon ? (
        <DropdownMenuItem.LeadingIcon>
          <Icon color={color} name={action.icon} size="s20" />
        </DropdownMenuItem.LeadingIcon>
      ) : null}
    </DropdownMenuItem>
  )
}

/**
 * Material's dropdown menu, anchored to its trigger. The items live in the `Items` slot, which Compose presents in
 * its own popup — anywhere else they would be laid out in place, on top of the trigger.
 */
export const Menu: MenuComponent = ({actions, label}: MenuProps) => {
  useHostGuard('Menu')

  const theme = useAppTheme()
  const [expanded, setExpanded] = useState(false)
  const dismiss = useCallback(() => setExpanded(false), [])

  return (
    <DropdownMenu color={theme.color('surface.primary')} expanded={expanded} onDismissRequest={dismiss}>
      <DropdownMenu.Trigger>
        <HStack align="center" onPress={() => setExpanded(true)} spacing="s4">
          <Text color="content.accent">{label}</Text>
          <Glyph color="content.accent" name="chevronDown" size="s16" />
        </HStack>
      </DropdownMenu.Trigger>
      <DropdownMenu.Items>
        {actions.map(action => (
          <MenuItem action={action} key={action.label} onDismiss={dismiss} />
        ))}
      </DropdownMenu.Items>
    </DropdownMenu>
  )
}
