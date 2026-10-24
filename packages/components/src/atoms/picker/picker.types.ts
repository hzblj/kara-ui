import type {ReactNode} from 'react'

/** One choice of a `Picker`. */
export type PickerOption = {
  /** What the user reads. */
  label: string
  /** What `onValueChange` reports. It also keys the option, so it must be unique. */
  value: string
}

/**
 * A single choice from a list: a SwiftUI wheel picker on iOS, Material's exposed dropdown on Android. It brings its
 * own host, so it renders outside `Screen` and `Island` as well. Inside one it renders into that host instead, so it
 * can share a stack with other native views.
 */
export type PickerProps = {
  /** Stops the user changing the selection, and dims the picker. */
  disabled?: boolean
  /** Called with the chosen option's `value`. */
  onValueChange?: (value: string) => void
  /** The choices, in order. */
  options: PickerOption[]
  /**
   * Android: the dropdown field's test tag. iOS: the wheel's, inside a `Screen` or `Island` only; on its own,
   * `@expo/ui`'s wheel picker drops it.
   */
  testID?: string
  /** The selected option's `value`. Controlled: pass back what `onValueChange` reports. */
  value: string
}

export type PickerComponent = (props: PickerProps) => ReactNode
