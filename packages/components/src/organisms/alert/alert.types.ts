import type {ReactNode} from 'react'

/**
 * A modal alert with a confirm button and a cancel button (or the confirm button alone): SwiftUI's alert on iOS,
 * Material's `AlertDialog` on Android. A native atom: it renders inside `<Screen>` or `<Island>`.
 */
export type AlertProps = {
  /**
   * The cancel button's label, in the app's language: "Zrušit". `Cancel` by default. `null` leaves the button out, for
   * an alert that only informs and is closed by its confirm button alone ("OK").
   */
  cancelLabel?: string | null
  /** The confirm button's label. `OK` by default. */
  confirmLabel?: string
  /** Marks the confirm button destructive: the system's destructive role on iOS, the destructive colour on Android. */
  destructive?: boolean
  /** The body text, under the title. */
  message?: string
  /** The confirm button was pressed. `onDismiss` follows, as it does for every way the alert closes. */
  onConfirm?: () => void
  /** The alert closed (any of its buttons, or on Android a tap outside or back), so turn `visible` off. */
  onDismiss: () => void
  /** The alert's heading. */
  title: string
  /** Shows the alert while true. */
  visible: boolean
}

export type AlertComponent = (props: AlertProps) => ReactNode
