import {Button, Menu} from '@expo/ui/swift-ui'
import type {SFSymbol} from 'sf-symbols-typescript'

import {Icon, SF_SYMBOLS} from '../../atoms/icon'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {FabMenuComponent, FabMenuProps} from './fab-menu.types'

/** Matches `Fab`, so a screen can switch between the two without the button changing shape. */
const FAB_SIZE = 56

export const FabMenu: FabMenuComponent = ({actions, icon = 'add', testID}: FabMenuProps) => {
  useHostGuard('FabMenu')

  return (
    <Menu
      label={
        <VStack
          align="center"
          bg="fill.accent.primary"
          borderRadius="full"
          h={FAB_SIZE}
          p="s16"
          shadow="btn.accent"
          w={FAB_SIZE}
        >
          <Icon color="content.on.bg" name={icon} />
        </VStack>
      }
      testID={testID}
    >
      {actions.map(action => (
        <Button
          key={action.label}
          label={action.label}
          onPress={action.onPress}
          role={action.destructive ? 'destructive' : 'default'}
          systemImage={action.icon ? (SF_SYMBOLS[action.icon] as SFSymbol) : undefined}
        />
      ))}
    </Menu>
  )
}
