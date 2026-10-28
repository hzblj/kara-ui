import {Button, Image, Label, Menu} from '@expo/ui/swift-ui'
import {disabled} from '@expo/ui/swift-ui/modifiers'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {Glyph} from '../../atoms/glyph'
import {Icon} from '../../atoms/icon'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../hooks/host-context'
import type {FabMenuComponent, FabMenuProps} from './fab-menu.types'

/** Matches `Fab`, so a screen can switch between the two without the button changing shape. */
const FAB_SIZE = 56

const DISABLED = [disabled(true)]

export const FabMenu: FabMenuComponent = ({accessibilityLabel, actions, icon, testID}: FabMenuProps) => {
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
          {icon ? (
            <Icon accessibilityLabel={accessibilityLabel} color="content.on.accent" name={icon} />
          ) : (
            <Glyph accessibilityLabel={accessibilityLabel} color="content.on.accent" name="plus" />
          )}
        </VStack>
      }
      testID={testID}
    >
      {actions.map(action => (
        <Button
          key={action.label}
          modifiers={action.disabled ? DISABLED : undefined}
          onPress={action.onPress}
          role={action.destructive ? 'destructive' : 'default'}
        >
          {/* A menu row is the system's Label: our icon is its image, from the asset catalog, and UIKit sizes it. */}
          <Label
            icon={action.icon ? <Image assetName={iconResourceName(action.icon)} /> : undefined}
            title={action.label}
          />
        </Button>
      ))}
    </Menu>
  )
}
