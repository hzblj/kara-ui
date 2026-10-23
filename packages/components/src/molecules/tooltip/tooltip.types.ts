import type {ReactNode} from 'react'

/**
 * A short text tip on a native view, shown while `visible`: a SwiftUI popover from `children` on iOS, Material's plain
 * tooltip centred above them on Android. A native atom: it renders inside `<Screen>` or `<Island>`; `RnTooltip`
 * anchors to a React Native view.
 */
export type TooltipProps = {
  /** The anchor: a native view. */
  children: ReactNode
  /** The tip. */
  text: string
  /** Shows the tip while true. Controlled: nothing opens it but this. Wire a long press to it if you want one. */
  visible: boolean
  /**
   * The user dismissed the tip, so turn `visible` off. iOS: a tap outside the popover. Android: any touch outside it,
   * the start of a scroll included, or the anchor scrolling out of the window.
   */
  onDismiss: () => void
}

export type TooltipComponent = (props: TooltipProps) => ReactNode
