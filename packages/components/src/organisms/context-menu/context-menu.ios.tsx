import {Button, ContextMenu as SwiftUIContextMenu} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {ContextMenuComponent, ContextMenuProps} from './context-menu.types'

export const ContextMenu: ContextMenuComponent = ({actions, children}: ContextMenuProps) => {
  useHostGuard('ContextMenu')

  return (
    <SwiftUIContextMenu>
      <SwiftUIContextMenu.Items>
        {actions.map(action => (
          <Button
            key={action.label}
            label={action.label}
            onPress={action.onPress}
            role={action.destructive ? 'destructive' : 'default'}
          />
        ))}
      </SwiftUIContextMenu.Items>
      <SwiftUIContextMenu.Trigger>{children}</SwiftUIContextMenu.Trigger>
    </SwiftUIContextMenu>
  )
}
