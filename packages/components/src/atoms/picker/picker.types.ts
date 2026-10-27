import type {ReactNode} from 'react'

/** One choice of a `Picker`. */
export type PickerOption = {
  /** What the user reads. */
  label: string
  /** What `onValueChange` reports. It also keys the option, so it must be unique. */
  value: string
}

/** How SwiftUI shows the picker: a wheel, or a button that opens the options as a menu. */
export type PickerStyleName = 'menu' | 'wheel'

/**
 * A single choice from a list: a SwiftUI picker on iOS (a wheel, or a menu with `pickerStyle`), Material's exposed
 * dropdown on Android. It brings its own host, so it renders outside `Screen` and `Island` as well. Inside one it
 * renders into that host instead, so it can share a stack with other native views.
 */
export type PickerProps = {
  /** Stops the user changing the selection, and dims the picker. */
  disabled?: boolean
  /** Called with the chosen option's `value`. */
  onValueChange?: (value: string) => void
  /** The choices, in order. */
  options: PickerOption[]
  /**
   * SwiftUI's picker style. `wheel` by default: the options on a wheel, always in view. `menu` is a button with the
   * selection, in the accent, that opens the options as a menu: what a screen with more than one picker, or a picker
   * in a row, wants. iOS only. Android ignores it: its exposed dropdown is a menu already.
   */
  pickerStyle?: PickerStyleName
  /**
   * Android: the dropdown field's test tag. iOS: the wheel's, inside a `Screen` or `Island` only; on its own,
   * `@expo/ui`'s wheel picker drops it.
   */
  testID?: string
  /** The selected option's `value`. Controlled: pass back what `onValueChange` reports. */
  value: string
}

export type PickerComponent = (props: PickerProps) => ReactNode
