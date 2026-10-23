import type {ReactElement, ReactNode} from 'react'

export type RnTooltipActionVariant = 'link' | 'primary' | 'secondary'

/** A button in an `RnTooltip`. */
export type RnTooltipAction = {
  /** The button's text. */
  label: string
  /** Called on press. The tooltip stays up; turn `visible` off here if the action should close it. */
  onPress: () => void
  /** `link` by default, an underlined text. `primary`/`secondary` are small filled/outlined buttons. */
  variant?: RnTooltipActionVariant
}

/** `outside`: a touch outside the bubble. `anchorHidden`: the anchor's centre left the visible area. */
export type RnTooltipDismissReason = 'anchorHidden' | 'outside'

/**
 * A rich tooltip (title, message, actions) anchored below a React Native view, and drawn above every sibling.
 * Controlled: it never hides itself. `onDismiss` reports why it should, and the caller turns `visible` off. The React
 * Native tier, unlike `Tooltip`, whose anchor is a native view inside a host.
 */
export type RnTooltipProps = {
  /** A row of buttons under the text, in order. */
  actions?: RnTooltipAction[]
  /** Which end of the bubble the actions sit at. `end` by default. */
  actionsAlignment?: 'end' | 'start'
  /**
   * Insets from the window's top and bottom that the anchor's centre must stay inside (a header or a tab bar over the
   * content). Past them the tooltip asks to be dismissed with `anchorHidden`.
   */
  boundaryInsets?: {bottom?: number; top?: number}
  /** The anchor: a single React Native view. */
  children: ReactElement
  /** The body text, under the title. */
  message?: string
  /**
   * Asks for the tooltip to close, with the reason; turn `visible` off. On Android any touch outside asks, the start
   * of a scroll included; iOS keeps the tooltip through a scroll.
   */
  onDismiss: (reason: RnTooltipDismissReason) => void
  /** The appear animation finished. */
  onShown?: () => void
  /** The heading line, above the message. */
  title?: string
  /** Shows the tooltip while true. It never hides itself. */
  visible: boolean
}

export type RnTooltipComponent = (props: RnTooltipProps) => ReactNode
