import {DateTimePicker} from '@expo/ui/community/datetime-picker'
import {useCallback} from 'react'

import type {DatePickerComponent, DatePickerProps} from './date-picker.types'

/** The system's compact date picker, inline: a tap on it opens the calendar popover UIKit owns. */
export const DatePicker: DatePickerComponent = ({
  max,
  min,
  mode = 'date',
  onValueChange,
  testID,
  value,
}: DatePickerProps) => {
  const onChange = useCallback((_event: unknown, date: Date) => onValueChange?.(date), [onValueChange])

  return (
    <DateTimePicker
      maximumDate={max}
      minimumDate={min}
      mode={mode}
      onValueChange={onChange}
      testID={testID}
      value={value}
    />
  )
}
