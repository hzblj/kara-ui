import {Text as ComposeText, DropdownMenu, DropdownMenuItem, Host} from '@expo/ui/jetpack-compose'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useState} from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import type {MenuAction} from '../menu'
import type {RnContextMenuComponent, RnContextMenuExclusionProps, RnContextMenuProps} from './rn-context-menu.types'

/**
 * The menu's anchor: a point at the trigger's bottom start, so the dropdown opens just under it. The host lies outside
 * the touch path — the dropdown is a popup window of its own, which takes its touches regardless.
 */
const styles = StyleSheet.create({
  anchor: {bottom: 0, height: 1, left: 0, position: 'absolute', width: 1},
})

type MenuRowProps = {
  action: MenuAction
  onDismiss: () => void
}

/** A row's `onClick` closes over its own action, so memoising it needs a component per row. */
const MenuRow = ({action, onDismiss}: MenuRowProps) => {
  const theme = useAppTheme()

  const onClick = useCallback(() => {
    onDismiss()
    action.onPress()
  }, [action, onDismiss])

  return (
    <DropdownMenuItem onClick={onClick}>
      <DropdownMenuItem.Text>
        <ComposeText
          color={theme.colorString(action.destructive ? 'content.destructive' : 'content.primary')}
          style={theme.typography.body}
        >
          {action.label}
        </ComposeText>
      </DropdownMenuItem.Text>
    </DropdownMenuItem>
  )
}

/**
 * The trigger stays a plain React Native subtree; a long press on it expands a Compose `DropdownMenu` anchored under
 * it. The host behind the menu mounts on the first long press and stays — a list of triggers that are only scrolled
 * past never builds one. `preview` and `onPreviewPress` are iOS-only: Material has no lifted preview.
 */
const RnContextMenuRoot = ({actions, children, testID, ...props}: RnContextMenuProps) => {
  const {onPreviewPress: _onPreviewPress, preview: _preview, ...sx} = props
  const theme = useAppTheme()
  const style = useSx(sx)
  const [isHostMounted, setIsHostMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const open = useCallback(() => {
    setIsHostMounted(true)
    setExpanded(true)
  }, [])

  const dismiss = useCallback(() => setExpanded(false), [])

  return (
    <Pressable onLongPress={open} style={style} testID={testID}>
      {children}
      {isHostMounted ? (
        <Host
          colorScheme={theme.dark ? 'dark' : 'light'}
          pointerEvents="none"
          seedColor={theme.materialSeed}
          style={styles.anchor}
        >
          <DropdownMenu expanded={expanded} onDismissRequest={dismiss}>
            <DropdownMenu.Items>
              {actions.map(action => (
                <MenuRow action={action} key={action.label} onDismiss={dismiss} />
              ))}
            </DropdownMenu.Items>
          </DropdownMenu>
        </Host>
      ) : null}
    </Pressable>
  )
}

/** A touchable inside the trigger already claims its own long press on Android, so this only has to group. */
const Exclusion = ({children}: RnContextMenuExclusionProps) => <View>{children}</View>

export const RnContextMenu: RnContextMenuComponent = Object.assign(RnContextMenuRoot, {Exclusion})
