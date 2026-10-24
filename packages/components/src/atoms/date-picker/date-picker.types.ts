import type {ReactNode} from 'react'

export type DatePickerMode = 'date' | 'datetime' | 'time'

/**
 * A date or time picker: SwiftUI's compact `DatePicker` on iOS, a field that opens Material's picker dialog on a tap
 * on Android. The React Native tier: it brings its own host and sizes itself to the value, so it sits in a row beside
 * its label like a `Text`. Inside a `Screen` or `Island` it joins that host instead, beside a native `Text` label.
 */
export type DatePickerProps = {
  /** The latest date that can be picked. Android ignores it in `time` mode. */
  max?: Date
  /** The earliest date that can be picked. Android ignores it in `time` mode. */
  min?: Date
  /**
   * What it picks. `date` by default. Android has no combined dialog, so there `datetime` picks the date and keeps
   * `value`'s time of day.
   */
  mode?: DatePickerMode
  /** Called with the new date: on iOS as it changes, on Android when the dialog is confirmed. */
  onValueChange?: (date: Date) => void
  /** Test identifier, on the native picker on iOS and on the tappable field on Android. */
  testID?: string
  /** The selected date. Controlled: update it from `onValueChange`. */
  value: Date
}

export type DatePickerComponent = (props: DatePickerProps) => ReactNode
