import {Text as ComposeText, DropdownMenu, DropdownMenuItem} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {type ReactNode, useCallback, useState} from 'react'
import {Glyph} from '../../atoms/glyph'
import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {IconButton} from '../../atoms/icon-button'
import {Text} from '../../atoms/text'
import {useHostGuard} from '../../hooks/host-context'
import type {MenuAction, MenuComponent, MenuProps} from './menu.types'
import {isIconOnly, menuActionColor} from './menu-parts'

type MenuItemProps = {
  action: MenuAction
  onDismiss: () => void
}

const MenuItem = ({action, onDismiss}: MenuItemProps) => {
  const theme = useAppTheme()
  const color = menuActionColor(action)

  return (
    <DropdownMenuItem
      elementColors={{leadingIconColor: theme.color(color), textColor: theme.color(color)}}
      enabled={!action.disabled}
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

const triggerOf = (props: MenuProps, open: () => void): ReactNode => {
  if (isIconOnly(props)) {
    // Material's overflow menu: an icon button, its label carried by the icon.
    return (
      <IconButton
        accessibilityLabel={props.accessibilityLabel}
        name={props.icon}
        onPress={open}
        testID={props.testID}
      />
    )
  }

  const {accessibilityLabel, icon, label, testID} = props

  return (
    <HStack accessibilityLabel={accessibilityLabel} align="center" onPress={open} spacing="s4" testID={testID}>
      {icon ? (
        <HStack align="center" spacing="s8">
          <Icon color="content.accent" name={icon} size="s20" />
          <Text color="content.accent">{label}</Text>
        </HStack>
      ) : (
        <Text color="content.accent">{label}</Text>
      )}
      <Glyph color="content.accent" name="chevronDown" size="s16" />
    </HStack>
  )
}

/**
 * Material's dropdown menu, anchored to its trigger. The items live in the `Items` slot, which Compose presents in
 * its own popup — anywhere else they would be laid out in place, on top of the trigger.
 */
export const Menu: MenuComponent = (props: MenuProps) => {
  useHostGuard('Menu')

  const theme = useAppTheme()
  const [expanded, setExpanded] = useState(false)
  const open = useCallback(() => setExpanded(true), [])
  const dismiss = useCallback(() => setExpanded(false), [])

  return (
    <DropdownMenu color={theme.color('surface.primary')} expanded={expanded} onDismissRequest={dismiss}>
      <DropdownMenu.Trigger>{triggerOf(props, open)}</DropdownMenu.Trigger>
      <DropdownMenu.Items>
        {props.actions.map(action => (
          <MenuItem action={action} key={action.label} onDismiss={dismiss} />
        ))}
      </DropdownMenu.Items>
    </DropdownMenu>
  )
}
