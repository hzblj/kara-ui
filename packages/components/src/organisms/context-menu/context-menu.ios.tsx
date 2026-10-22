import {iconResourceName} from '@hzblj/kara-native'
import {
  type ContextMenuItem,
  ContextMenu as NativeContextMenu,
  ContextMenuExclusion as NativeContextMenuExclusion,
} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {useCallback, useMemo} from 'react'
import type {ContextMenuComponent, ContextMenuExclusionProps, ContextMenuProps} from './context-menu.types'

const ContextMenuRoot = ({
  actions,
  children,
  onPreviewPress,
  preview,
  previewTransition,
  testID,
  ...sx
}: ContextMenuProps) => {
  const style = useSx(sx)

  /** The native side hands back an id; the index is the one identity every action has. */
  const items = useMemo<ContextMenuItem[]>(
    () =>
      actions.map((action, index) => ({
        destructive: action.destructive,
        id: String(index),
        image: action.icon ? iconResourceName(action.icon) : undefined,
        title: action.label,
      })),
    [actions]
  )

  const onSelectItem = useCallback((id: string) => actions[Number(id)]?.onPress(), [actions])

  return (
    <NativeContextMenu
      items={items}
      onPreviewPress={onPreviewPress}
      onSelectItem={onSelectItem}
      preview={preview}
      previewTransition={previewTransition}
      style={style}
      testID={testID}
    >
      {children}
    </NativeContextMenu>
  )
}

const Exclusion = ({children}: ContextMenuExclusionProps) => (
  <NativeContextMenuExclusion>{children}</NativeContextMenuExclusion>
)

export const ContextMenu: ContextMenuComponent = Object.assign(ContextMenuRoot, {Exclusion})
