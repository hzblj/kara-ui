import {
  type ContextMenuItem,
  ContextMenu as NativeContextMenu,
  ContextMenuExclusion as NativeContextMenuExclusion,
} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {useCallback, useMemo} from 'react'
import type {SFSymbol} from 'sf-symbols-typescript'
import {SF_SYMBOLS} from '../../atoms/icon'
import type {RnContextMenuComponent, RnContextMenuExclusionProps, RnContextMenuProps} from './rn-context-menu.types'

const RnContextMenuRoot = ({actions, children, onPreviewPress, preview, testID, ...sx}: RnContextMenuProps) => {
  const style = useSx(sx)

  /** The native side hands back an id; the index is the one identity every action has. */
  const items = useMemo<ContextMenuItem[]>(
    () =>
      actions.map((action, index) => ({
        destructive: action.destructive,
        id: String(index),
        systemImage: action.icon ? (SF_SYMBOLS[action.icon] as SFSymbol) : undefined,
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
      style={style}
      testID={testID}
    >
      {children}
    </NativeContextMenu>
  )
}

const Exclusion = ({children}: RnContextMenuExclusionProps) => (
  <NativeContextMenuExclusion>{children}</NativeContextMenuExclusion>
)

export const RnContextMenu: RnContextMenuComponent = Object.assign(RnContextMenuRoot, {Exclusion})
