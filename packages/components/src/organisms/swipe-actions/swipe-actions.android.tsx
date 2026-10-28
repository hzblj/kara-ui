import {FilledIconButton} from '@expo/ui/jetpack-compose'
import {size} from '@expo/ui/jetpack-compose/modifiers'
import {SwipeActionsBox, type SwipeActionsBoxEdge} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useEffect, useId, useState, useSyncExternalStore} from 'react'

import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../hooks/host-context'
import type {SwipeAction, SwipeActionsComponent, SwipeActionsProps} from './swipe-actions.types'

/** A Material 3 Expressive wide icon button: wider than tall, a stadium, the label under it. */
const BUTTON = [size(52, 32)]

/**
 * Which row is open, app-wide — SwiftUI's list keeps one row open, and so does this: opening one closes the last.
 * React state cannot be shared between rows that know nothing of each other, so it lives in the module.
 */
let openRow: string | null = null

const listeners = new Set<() => void>()

const setOpenRow = (row: string | null) => {
  if (openRow === row) {
    return
  }

  openRow = row

  for (const listener of listeners) {
    listener()
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const getOpenRow = () => openRow

type ActionButtonProps = {action: SwipeAction; onDone: () => void}

const ActionButton = ({action, onDone}: ActionButtonProps) => {
  const theme = useAppTheme()
  const fill = action.tint ?? (action.destructive ? 'fill.destructive.primary' : 'fill.accent.primary')
  const content = !action.tint && action.destructive ? 'content.on.destructive' : 'content.on.accent'

  const onClick = useCallback(() => {
    onDone()
    action.onPress()
  }, [action, onDone])

  return (
    <VStack align="center" spacing="s2">
      <FilledIconButton
        colors={{containerColor: theme.color(fill), contentColor: theme.color(content)}}
        modifiers={BUTTON}
        onClick={onClick}
      >
        <Icon accessibilityLabel={action.label} color={content} name={action.icon} size="s20" />
      </FilledIconButton>
      <Text color="content.secondary" variant="labelMedium">
        {action.label}
      </Text>
    </VStack>
  )
}

const Actions = ({actions, onDone}: {actions: SwipeAction[]; onDone: () => void}) => (
  <HStack align="center" spacing="s8">
    {actions.map(action => (
      <ActionButton action={action} key={action.label} onDone={onDone} />
    ))}
  </HStack>
)

const close = () => setOpenRow(null)

/**
 * kara's `SwipeActionsBox`: the row slides on an anchored drag and the buttons show in the strip it leaves, fading in.
 * Controlled from here so one row is open at a time; a press closes the row before the action runs.
 */
export const SwipeActions: SwipeActionsComponent = ({children, leading = [], trailing = []}: SwipeActionsProps) => {
  useHostGuard('SwipeActions')
  const row = useId()
  const isOpenRow = useSyncExternalStore(subscribe, getOpenRow) === row
  const [edge, setEdge] = useState<SwipeActionsBoxEdge | null>(null)

  const onOpenChange = useCallback(
    (next: SwipeActionsBoxEdge | null) => {
      setEdge(next)

      if (next) {
        setOpenRow(row)
      } else if (openRow === row) {
        setOpenRow(null)
      }
    },
    [row]
  )

  // A row that goes away open must not keep the others from opening.
  useEffect(
    () => () => {
      if (openRow === row) {
        setOpenRow(null)
      }
    },
    [row]
  )

  return (
    <SwipeActionsBox actionsSpacing={spacing.s12} onOpenChange={onOpenChange} openEdge={isOpenRow ? edge : null}>
      {leading.length > 0 ? (
        <SwipeActionsBox.Leading>
          <Actions actions={leading} onDone={close} />
        </SwipeActionsBox.Leading>
      ) : null}
      {trailing.length > 0 ? (
        <SwipeActionsBox.Trailing>
          {/* The first action sits outermost — at the right-hand end of a trailing row. */}
          <Actions actions={[...trailing].reverse()} onDone={close} />
        </SwipeActionsBox.Trailing>
      ) : null}
      {children}
    </SwipeActionsBox>
  )
}
