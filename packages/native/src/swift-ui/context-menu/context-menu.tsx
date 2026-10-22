import type {ReactNode} from 'react'
import {type GestureResponderEvent, type StyleProp, StyleSheet, type ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {ContextMenuItem, ContextMenuPreviewTransition, ContextMenuProps} from './context-menu.types'
import {useDeferredPreview} from './use-deferred-preview'

type NativeContextMenuProps = {
  children: ReactNode
  items: ContextMenuItem[]
  onPreviewPress?: () => void
  onSelectItem?: (event: {nativeEvent: {id: string}}) => void
  onTouchCancel?: (event: GestureResponderEvent) => void
  onTouchEnd?: (event: GestureResponderEvent) => void
  onTouchMove?: (event: GestureResponderEvent) => void
  onTouchStart?: (event: GestureResponderEvent) => void
  previewTransition?: ContextMenuPreviewTransition
  style?: StyleProp<ViewStyle>
  testID?: string
}

type ContainerProps = {children: ReactNode; style?: StyleProp<ViewStyle>}

const NativeContextMenu = requireKaraView<NativeContextMenuProps>('ContextMenuView')

const NativeContextMenuPreview = requireKaraView<ContainerProps>('ContextMenuPreviewView')

const NativeContextMenuExclusion = requireKaraView<ContainerProps>('ContextMenuExclusionView')

const styles = StyleSheet.create({
  preview: {position: 'absolute'},
})

/**
 * A `UIContextMenuInteraction` on React Native children, with a React Native preview and a commit callback for a tap
 * on that preview — what SwiftUI's `contextMenu` cannot deliver.
 */
export const ContextMenu = ({
  children,
  items,
  onPreviewPress,
  onSelectItem,
  preview,
  previewTransition,
  style,
  testID,
}: ContextMenuProps) => {
  const {isPreviewMounted, onTouchEnd, onTouchMove, onTouchStart} = useDeferredPreview()
  const hasPreview = preview != null

  return (
    <NativeContextMenu
      items={items}
      onPreviewPress={onPreviewPress}
      onSelectItem={onSelectItem ? event => onSelectItem(event.nativeEvent.id) : undefined}
      onTouchCancel={hasPreview ? onTouchEnd : undefined}
      onTouchEnd={hasPreview ? onTouchEnd : undefined}
      onTouchMove={hasPreview ? onTouchMove : undefined}
      onTouchStart={hasPreview ? onTouchStart : undefined}
      previewTransition={previewTransition}
      style={style}
      testID={testID}
    >
      {children}
      {hasPreview && isPreviewMounted ? (
        <NativeContextMenuPreview style={styles.preview}>{preview}</NativeContextMenuPreview>
      ) : null}
    </NativeContextMenu>
  )
}

/** A region of the trigger that must not open the menu — a button inside a card. */
export const ContextMenuExclusion = ({children}: {children: ReactNode}) => (
  <NativeContextMenuExclusion>{children}</NativeContextMenuExclusion>
)
