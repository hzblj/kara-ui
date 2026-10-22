import {Text as ComposeText, DropdownMenu, DropdownMenuItem, Host} from '@expo/ui/jetpack-compose'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import * as Haptics from 'expo-haptics'
import {useCallback, useMemo, useRef, useState} from 'react'
import {type GestureResponderEvent, Pressable, StyleSheet, View} from 'react-native'
import {Icon} from '../../atoms/icon'
import {HostBoundary} from '../../host-context'
import {splitForRipple} from '../../ripple-clip'
import type {MenuAction} from '../menu'
import type {ContextMenuComponent, ContextMenuExclusionProps, ContextMenuProps} from './context-menu.types'

type Point = {x: number; y: number}

const styles = StyleSheet.create({
  /** A point under the finger: the dropdown opens from it. The menu is a popup window, so nothing clips it. */
  anchor: {height: 1, position: 'absolute', width: 1},
})

type MenuRowProps = {
  action: MenuAction
  onDismiss: () => void
}

/** A row's `onClick` closes over its own action, so memoising it needs a component per row. */
const MenuRow = ({action, onDismiss}: MenuRowProps) => {
  const theme = useAppTheme()
  const color = action.destructive ? 'content.destructive' : 'content.primary'

  const onClick = useCallback(() => {
    onDismiss()
    action.onPress()
  }, [action, onDismiss])

  return (
    <DropdownMenuItem onClick={onClick}>
      <DropdownMenuItem.Text>
        <ComposeText color={theme.colorString(color)} style={theme.typography.body}>
          {action.label}
        </ComposeText>
      </DropdownMenuItem.Text>
      {action.icon ? (
        <DropdownMenuItem.LeadingIcon>
          <Icon color={color} name={action.icon} size="s20" />
        </DropdownMenuItem.LeadingIcon>
      ) : null}
    </DropdownMenuItem>
  )
}

/**
 * Android's own take on a context menu, since Material has no lifted preview: a long press ripples the trigger, ticks
 * the long-press haptic, and opens a Material dropdown where the finger is — the trigger stays highlighted while the
 * menu is up. The host behind the menu mounts on the first long press and stays, so a list of triggers that are only
 * scrolled past never builds one. `preview`, `onPreviewPress` and `previewTransition` are iOS-only.
 */
const ContextMenuRoot = ({actions, children, testID, ...props}: ContextMenuProps) => {
  const {onPreviewPress: _onPreviewPress, preview: _preview, previewTransition: _previewTransition, ...sx} = props
  const theme = useAppTheme()
  const resolved = useSx(sx)
  const trigger = useRef<View>(null)
  const [anchor, setAnchor] = useState<Point | null>(null)
  const [expanded, setExpanded] = useState(false)

  // The shape clips on an outer view, so the ripple and the highlight follow the trigger's rounded corners.
  const {inner, outer} = useMemo(() => splitForRipple(resolved), [resolved])
  const ripple = useMemo(() => ({color: theme.color('fill.tertiary')}), [theme])
  const highlight = useMemo(() => ({backgroundColor: theme.color('fill.tertiary')}), [theme])

  const open = useCallback((event: GestureResponderEvent) => {
    const {pageX, pageY} = event.nativeEvent

    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press).catch(() => undefined)
    // The touch in the trigger's own coordinates: `locationX/Y` are relative to whichever child was touched.
    trigger.current?.measure((_x, _y, _width, _height, left, top) => {
      setAnchor({x: pageX - left, y: pageY - top})
      setExpanded(true)
    })
  }, [])

  const dismiss = useCallback(() => setExpanded(false), [])

  return (
    <View style={outer}>
      <Pressable android_ripple={ripple} onLongPress={open} ref={trigger} style={inner} testID={testID}>
        {/* Under the content, over the trigger's own background: the card tints, its text stays. */}
        {expanded ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, highlight]} /> : null}
        {children}
        {anchor ? (
          <Host
            colorScheme={theme.dark ? 'dark' : 'light'}
            pointerEvents="none"
            seedColor={theme.materialSeed}
            style={[styles.anchor, {left: anchor.x, top: anchor.y}]}
          >
            <HostBoundary>
              <DropdownMenu color={theme.color('surface.primary')} expanded={expanded} onDismissRequest={dismiss}>
                <DropdownMenu.Items>
                  {actions.map(action => (
                    <MenuRow action={action} key={action.label} onDismiss={dismiss} />
                  ))}
                </DropdownMenu.Items>
              </DropdownMenu>
            </HostBoundary>
          </Host>
        ) : null}
      </Pressable>
    </View>
  )
}

/** A touchable inside the trigger already claims its own long press on Android, so this only has to group. */
const Exclusion = ({children}: ContextMenuExclusionProps) => <View>{children}</View>

export const ContextMenu: ContextMenuComponent = Object.assign(ContextMenuRoot, {Exclusion})
