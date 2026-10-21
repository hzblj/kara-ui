import {Button, Menu as SwiftUIMenu} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {MenuComponent, MenuProps} from './menu.types'

export const Menu: MenuComponent = ({actions, label}: MenuProps) => {
  useHostGuard('Menu')

  return (
    <SwiftUIMenu label={label}>
      {actions.map(action => (
        <Button
          key={action.label}
          label={action.label}
          onPress={action.onPress}
          role={action.destructive ? 'destructive' : 'default'}
        />
      ))}
    </SwiftUIMenu>
  )
}
