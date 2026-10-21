import {type ReactNode, useCallback} from 'react'
import type {ColorValue, NativeSyntheticEvent, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {
  TooltipAction,
  TooltipActionsAlignment,
  TooltipDismissReason,
  TooltipProps,
  TooltipTextStyle,
} from './tooltip.types'

/** `width` and `shadowColor` are renamed on the way: Fabric would read either one as a style key. */
type NativeTooltipProps = {
  actions?: TooltipAction[]
  actionsAlignment?: TooltipActionsAlignment
  actionStyle: TooltipTextStyle
  boundaryInsetBottom: number
  boundaryInsetTop: number
  bubbleColor: ColorValue
  bubbleShadowColor: ColorValue
  bubbleWidth?: number
  children: ReactNode
  isPresented: boolean
  linkColor: ColorValue
  message?: string
  messageColor: ColorValue
  messageStyle: TooltipTextStyle
  onAction?: (event: NativeSyntheticEvent<{index: number}>) => void
  onDismissRequest?: (event: NativeSyntheticEvent<{reason: TooltipDismissReason}>) => void
  onShown?: () => void
  primaryTint: ColorValue
  secondaryTint: ColorValue
  style?: StyleProp<ViewStyle>
  title?: string
  titleColor: ColorValue
  titleStyle: TooltipTextStyle
}

const NativeTooltip = requireKaraView<NativeTooltipProps>('TooltipView')

/**
 * A controlled rich tooltip anchored to its React Native children, drawn in SwiftUI above every sibling. It never hides
 * itself — `onDismissRequest` says why it should, and the caller flips `isPresented`.
 */
export const Tooltip = ({
  boundaryInsets,
  onAction,
  onDismissRequest,
  onShown,
  shadowColor,
  width,
  ...props
}: TooltipProps) => {
  const handleShown = useCallback(() => onShown?.(), [onShown])

  const handleAction = useCallback(
    (event: NativeSyntheticEvent<{index: number}>) => onAction?.(event.nativeEvent.index),
    [onAction]
  )

  const handleDismissRequest = useCallback(
    (event: NativeSyntheticEvent<{reason: TooltipDismissReason}>) => onDismissRequest(event.nativeEvent.reason),
    [onDismissRequest]
  )

  return (
    <NativeTooltip
      {...props}
      boundaryInsetBottom={boundaryInsets?.bottom ?? 0}
      boundaryInsetTop={boundaryInsets?.top ?? 0}
      bubbleShadowColor={shadowColor}
      bubbleWidth={width}
      onAction={handleAction}
      onDismissRequest={handleDismissRequest}
      onShown={handleShown}
    />
  )
}
