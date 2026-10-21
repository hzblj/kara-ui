import type {ReactNode} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import type {TextWeight} from '../../text-weight'

export type TooltipDismissReason = 'anchorHidden' | 'outside'

export type TooltipActionVariant = 'link' | 'primary' | 'secondary'

export type TooltipAction = {
  label: string
  variant: TooltipActionVariant
}

export type TooltipActionsAlignment = 'end' | 'start'

export type TooltipTextStyle = {
  /** The system face when unset. */
  fontFamily?: string
  fontSize: number
  /** Applied to the system face only. */
  fontWeight?: TextWeight
  letterSpacing: number
  lineHeight: number
}

export type TooltipProps = {
  actions?: TooltipAction[]
  actionsAlignment?: TooltipActionsAlignment
  actionStyle: TooltipTextStyle
  /** Insets from the window's top and bottom the anchor's centre must stay inside, or `anchorHidden` is reported. */
  boundaryInsets?: {bottom?: number; top?: number}
  bubbleColor: ColorValue
  /** The anchor. */
  children: ReactNode
  isPresented: boolean
  linkColor: ColorValue
  message?: string
  messageColor: ColorValue
  messageStyle: TooltipTextStyle
  /** The index of the pressed action. */
  onAction?: (index: number) => void
  onDismissRequest: (reason: TooltipDismissReason) => void
  onShown?: () => void
  primaryTint: ColorValue
  secondaryTint: ColorValue
  shadowColor: ColorValue
  style?: StyleProp<ViewStyle>
  title?: string
  titleColor: ColorValue
  titleStyle: TooltipTextStyle
  /** The bubble's width in points, narrowed to fit the window. Defaults to 250. */
  width?: number
}
