import {type ReactNode, useCallback} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import {slot} from '../slot-view'
import type {SwipeActionsBoxEdge, SwipeActionsBoxProps} from './swipe-actions-box.types'

type NativeEdge = SwipeActionsBoxEdge | 'none'

type NativeSwipeActionsBoxProps = {
  actionsInset?: number
  actionsSpacing?: number
  children: ReactNode
  onOpenChange: (event: NativeSyntheticEvent<{edge: NativeEdge}>) => void
  openEdge: NativeEdge
}

const NativeSwipeActionsBox = requireKaraView<NativeSwipeActionsBoxProps>('SwipeActionsBoxView')

const SwipeActionsBoxRoot = ({onOpenChange, openEdge, ...props}: SwipeActionsBoxProps) => {
  const handleOpenChange = useCallback(
    (event: NativeSyntheticEvent<{edge: NativeEdge}>) => {
      const {edge} = event.nativeEvent
      onOpenChange(edge === 'none' ? null : edge)
    },
    [onOpenChange]
  )

  return <NativeSwipeActionsBox {...props} onOpenChange={handleOpenChange} openEdge={openEdge ?? 'none'} />
}

/**
 * A row that slides sideways to uncover what its `Leading` / `Trailing` slots hold — Compose has no swipe actions of
 * its own. Controlled through `openEdge`; while open, a tap on the row closes it instead of reaching the row.
 */
export const SwipeActionsBox = Object.assign(SwipeActionsBoxRoot, {
  Leading: slot('leading'),
  Trailing: slot('trailing'),
})
