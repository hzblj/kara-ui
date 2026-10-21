import {Picker as NativePicker} from '@expo/ui/community/picker'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback} from 'react'

import type {PickerComponent, PickerProps} from './picker.types'

export const Picker: PickerComponent = ({disabled = false, onValueChange, options, testID, value}: PickerProps) => {
  const theme = useAppTheme()

  const onChange = useCallback((next: string | number | null) => onValueChange?.(String(next)), [onValueChange])

  return (
    <NativePicker enabled={!disabled} onValueChange={onChange} selectedValue={value} testID={testID}>
      {options.map(option => (
        <NativePicker.Item
          color={theme.colorString('content.primary')}
          key={option.value}
          label={option.label}
          value={option.value}
        />
      ))}
    </NativePicker>
  )
}
