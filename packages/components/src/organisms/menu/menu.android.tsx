import {Text as ComposeText, DropdownMenu} from '@expo/ui/jetpack-compose'
import {clickable} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useState} from 'react'
import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {MenuAction, MenuComponent, MenuProps} from './menu.types'

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

export const Menu: MenuComponent = ({actions, label}: MenuProps) => {
  useHostGuard('Menu')

  const [expanded, setExpanded] = useState(false)
  const dismiss = useCallback(() => setExpanded(false), [])

  return (
    <VStack>
      <HStack align="center" onPress={() => setExpanded(true)} spacing="s4">
        <Text color="content.accent">{label}</Text>
        <Icon color="content.accent" name="chevronDown" size="s16" />
      </HStack>
      <DropdownMenu expanded={expanded} onDismissRequest={dismiss}>
        {actions.map(action => (
          <MenuItem action={action} key={action.label} onDismiss={dismiss} />
        ))}
      </DropdownMenu>
      <Spacer min="s0" />
    </VStack>
  )
}
