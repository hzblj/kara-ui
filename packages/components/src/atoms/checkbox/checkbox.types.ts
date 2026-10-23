import type {ReactNode} from 'react'

/** Material's `Checkbox` on Android. iOS has none, so there it is a SwiftUI `Toggle`, the same switch as `Switch`. */
export type CheckboxProps = {
  /** Dims the control and ignores taps. */
  disabled?: boolean
  /** Text beside the control. On Android the whole labelled row toggles it. */
  label?: string
  /** Called with the new value when the user toggles it. */
  onValueChange?: (value: boolean) => void
  /** Whether it is checked. Controlled: update it from `onValueChange`. */
  value: boolean
}

export type CheckboxComponent = (props: CheckboxProps) => ReactNode
