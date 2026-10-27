import {Host, DatePicker as SwiftUIDatePicker} from '@expo/ui/swift-ui'
import {
  datePickerStyle as datePickerStyleModifier,
  disabled as disabledModifier,
  labelsHidden,
  tint,
} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import type {DatePickerComponent, DatePickerMode, DatePickerProps} from './date-picker.types'

const COMPONENTS = {
  date: ['date'],
  datetime: ['date', 'hourAndMinute'],
  time: ['hourAndMinute'],
} as const satisfies Record<DatePickerMode, ('date' | 'hourAndMinute')[]>

/**
 * The system's date picker, in the accent. `compact` by default: the value in a pill, and a tap on it opens the
 * calendar popover UIKit owns. `graphical` is that calendar in place, `wheel` the value on wheels. Its own host, sized
 * to the picker on both axes (a host that took the width it was given would lay the pill out against the far edge of
 * it, or past its container's), so it drops into a row the way a `Text` does. The label is the caller's, beside it.
 * Inside a `Screen` or `Island` it renders into that host instead (see `useInsideHost`).
 */
export const DatePicker: DatePickerComponent = ({
  datePickerStyle = 'compact',
  disabled = false,
  max,
  min,
  mode = 'date',
  onValueChange,
  testID,
  value,
}: DatePickerProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()

  const modifiers = useMemo(
    () => [
      datePickerStyleModifier(datePickerStyle),
      labelsHidden(),
      tint(theme.color('fill.accent.primary')),
      ...(disabled ? [disabledModifier(true)] : []),
    ],
    [datePickerStyle, disabled, theme]
  )

  const picker = (
    <SwiftUIDatePicker
      displayedComponents={[...COMPONENTS[mode]]}
      modifiers={modifiers}
      onDateChange={onValueChange}
      range={min || max ? {end: max, start: min} : undefined}
      selection={value}
      testID={testID}
    />
  )

  if (insideHost) {
    return picker
  }

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents>
      {picker}
    </Host>
  )
}
