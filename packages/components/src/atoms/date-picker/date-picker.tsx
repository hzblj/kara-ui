import {DateTimePicker} from '@expo/ui/community/datetime-picker'
import {useCallback} from 'react'

import type {DatePickerComponent, DatePickerProps} from './date-picker.types'

export const DatePicker: DatePickerComponent = ({
  max,
  min,
  mode = 'date',
  onValueChange,
  testID,
  value,
}: DatePickerProps) => {
  const onChange = useCallback(
    (_event: unknown, date?: Date) => {
      if (date) {
        onValueChange?.(date)
      }
    },
    [onValueChange]
  )

  return (
    <DateTimePicker maximumDate={max} minimumDate={min} mode={mode} onChange={onChange} testID={testID} value={value} />
  )
}
