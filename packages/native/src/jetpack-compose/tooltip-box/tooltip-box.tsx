import {type ReactNode, useCallback} from 'react'
import type {ColorValue, NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import {slot} from '../slot-view'
import type {TooltipBoxDismissReason, TooltipBoxProps} from './tooltip-box.types'

type NativeTooltipBoxProps = {
  actionsAlignment?: 'end' | 'start'
  boundaryInsetBottom: number
  boundaryInsetTop: number
  children: ReactNode
  containerColor?: ColorValue
  isPresented: boolean
  maxWidth?: number
  onDismissRequest?: (event: NativeSyntheticEvent<{reason: TooltipBoxDismissReason}>) => void
  onShown?: () => void
}

const NativeTooltipBox = requireKaraView<NativeTooltipBoxProps>('TooltipBoxView')

const TooltipBoxRoot = ({boundaryInsets, onDismissRequest, onShown, ...props}: TooltipBoxProps) => {
  const handleShown = useCallback(() => onShown?.(), [onShown])

  const handleDismissRequest = useCallback(
    (event: NativeSyntheticEvent<{reason: TooltipBoxDismissReason}>) => onDismissRequest(event.nativeEvent.reason),
    [onDismissRequest]
  )

  return (
    <NativeTooltipBox
      {...props}
      boundaryInsetBottom={boundaryInsets?.bottom ?? 0}
      boundaryInsetTop={boundaryInsets?.top ?? 0}
      onDismissRequest={handleDismissRequest}
      onShown={handleShown}
    />
  )
}

/**
 * A controlled Material 3 rich tooltip below its anchor, with the M3 kit's own layout. It never hides itself —
 * `onDismissRequest` says why it should, and the caller flips `isPresented`.
 */
export const TooltipBox = Object.assign(TooltipBoxRoot, {
  Action: slot('action'),
  Text: slot('text'),
  Title: slot('title'),
})
