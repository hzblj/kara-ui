import {iconResourceName} from '@hzblj/expo-native-icons'
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
  onOpenChange,
  onPreviewPress,
  preloadedScreenId,
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

  const onMenuOpen = useCallback(() => onOpenChange?.(true), [onOpenChange])

  const onMenuClose = useCallback(
    (isCommitted: boolean) => {
      if (!isCommitted) {
        onOpenChange?.(false)
      }
    },
    [onOpenChange]
  )

  return (
    <NativeContextMenu
      items={items}
      onMenuClose={onOpenChange ? onMenuClose : undefined}
      onMenuOpen={onOpenChange ? onMenuOpen : undefined}
      onPreviewPress={onPreviewPress}
      onSelectItem={onSelectItem}
      preloadedScreenId={preloadedScreenId}
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
