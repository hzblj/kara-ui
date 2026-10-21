import type {ReactNode} from 'react'
import type {ColorValue} from 'react-native'

export type TooltipBoxDismissReason = 'anchorHidden' | 'outside'

export type TooltipBoxProps = {
  actionsAlignment?: 'end' | 'start'
  /** Insets from the window's top and bottom the anchor's centre must stay inside, or `anchorHidden` is reported. */
  boundaryInsets?: {bottom?: number; top?: number}
  /** `TooltipBox.Title`, `TooltipBox.Text`, `TooltipBox.Action` slots, and the anchor. */
  children: ReactNode
  containerColor?: ColorValue
  isPresented: boolean
  /** In dp. Material's rich tooltip width when unset. */
  maxWidth?: number
  onDismissRequest: (reason: TooltipBoxDismissReason) => void
  onShown?: () => void
}
