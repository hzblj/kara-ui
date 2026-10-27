import type {ReactNode} from 'react'

export type DatePickerMode = 'date' | 'datetime' | 'time'

/** How SwiftUI shows the picker: a pill that opens the calendar, the calendar in place, or wheels. */
export type DatePickerStyleName = 'compact' | 'graphical' | 'wheel'

/**
 * A date or time picker: SwiftUI's `DatePicker` on iOS (a pill by default, a calendar or wheels with
 * `datePickerStyle`), a field that opens Material's picker dialog on a tap on Android, or Material's calendar in place
 * with `datePickerStyle="graphical"`. The React Native tier: it brings its own host and sizes itself to the value, so it
 * sits in a row beside its label like a `Text`. Inside a `Screen` or `Island` it joins that host instead, beside a
 * native `Text` label.
 */
export type DatePickerProps = {
  /**
   * SwiftUI's date picker style. `compact` by default: the value in a pill, which opens the calendar in a popover.
   * `graphical` is the calendar in place, a month at a time, with the time under it in `datetime` mode: what a screen
   * built around picking a day wants. `wheel` puts the value on wheels. Android shows Material's calendar in place for
   * `graphical` in `date` and `datetime` modes (without its title and headline); otherwise it keeps its field and
   * dialog, since Material has no wheel.
   */
  datePickerStyle?: DatePickerStyleName
  /**
   * Stops the user changing the date, and dims the picker. Material's calendar has no disabled state of its own, so a
   * `graphical` picker on Android is dimmed and offers only the selected day.
   */
  disabled?: boolean
  /** The latest date that can be picked. Android ignores it in `time` mode. */
  max?: Date
  /** The earliest date that can be picked. Android ignores it in `time` mode. */
  min?: Date
  /**
   * What it picks. `date` by default. Android has no combined dialog or calendar, so there `datetime` picks the date
   * and keeps `value`'s time of day.
   */
  mode?: DatePickerMode
  /**
   * Called with the new date: on iOS as it changes, on Android when the dialog is confirmed or a day in the calendar
   * is tapped.
   */
  onValueChange?: (date: Date) => void
  /**
   * Test identifier, on the native picker on iOS and on Android's calendar, and on the tappable field elsewhere on
   * Android.
   */
  testID?: string
  /** The selected date. Controlled: update it from `onValueChange`. */
  value: Date
}

export type DatePickerComponent = (props: DatePickerProps) => ReactNode
