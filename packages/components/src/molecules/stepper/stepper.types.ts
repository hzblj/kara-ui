import type {ReactNode} from 'react'

/**
 * A number with minus and plus buttons beside a label: SwiftUI's `Stepper` on iOS; on Android the label, the value and
 * two icon buttons in a row. A native atom: it renders inside `<Screen>` or `<Island>`.
 */
export type StepperProps = {
  /**
   * What TalkBack says for the minus button. `Decrement` by default: pass the app's own words, in its language.
   * Android only. iOS ignores it: its native stepper labels its buttons itself, in the device's language.
   */
  decrementLabel?: string
  /** Stops the user changing the value, and dims the row. */
  disabled?: boolean
  /**
   * What TalkBack says for the plus button. `Increment` by default: pass the app's own words, in its language. Android
   * only. iOS ignores it: its native stepper labels its buttons itself, in the device's language.
   */
  incrementLabel?: string
  /** The leading text. The value is shown too: before the control on iOS, between the buttons on Android. */
  label: string
  /** The highest value. When unset, Android has no upper limit and iOS stops at `100`. */
  max?: number
  /** The lowest value. When unset, Android has no lower limit and iOS stops at `0`. */
  min?: number
  /** A button was pressed; it passes the new value, kept within `min` and `max`. */
  onValueChange: (value: number) => void
  /** How much one press adds or takes away. `1` by default. */
  step?: number
  /**
   * Test identifier, on the control rather than the row: SwiftUI's `Stepper` on iOS, the minus and plus buttons with
   * the value between them on Android. Reach a button by what screen readers say for it.
   */
  testID?: string
  /** The current value. Update it from `onValueChange`. iOS's native stepper counts in whole numbers. */
  value: number
}

export type StepperComponent = (props: StepperProps) => ReactNode
