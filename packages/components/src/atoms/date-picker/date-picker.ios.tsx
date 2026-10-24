import {Host, DatePicker as SwiftUIDatePicker} from '@expo/ui/swift-ui'
import {datePickerStyle, labelsHidden, tint} from '@expo/ui/swift-ui/modifiers'
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
 * The system's compact date picker: the value in a pill, and a tap on it opens the calendar popover UIKit owns. Its own
 * host, sized to the pill on both axes — a host that took the width it was given would lay the pill out against the
 * far edge of it, or past its container's — so it drops into a row the way a `Text` does. The label is the caller's,
 * beside it; the calendar is in the accent. Inside a `Screen` or `Island` it renders into that host instead (see
 * `useInsideHost`).
 */
export const DatePicker: DatePickerComponent = ({
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
    () => [datePickerStyle('compact'), labelsHidden(), tint(theme.color('fill.accent.primary'))],
    [theme]
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
