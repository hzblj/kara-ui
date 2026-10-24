import {Picker as NativePicker} from '@expo/ui/community/picker'
import {Picker as SwiftUIPicker, Text as SwiftUIText} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, foregroundStyle, pickerStyle, tag} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import type {PickerComponent, PickerProps} from './picker.types'

/**
 * A SwiftUI wheel. On its own it is `@expo/ui`'s community picker, which brings a host of its own. Inside a `Screen` or
 * `Island` it is the same wheel rendered into that host instead (see `useInsideHost`): a host nested in the island's
 * stack is given no height there, and the wheel spills over the views around it.
 */
export const Picker: PickerComponent = ({disabled = false, onValueChange, options, testID, value}: PickerProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const color = theme.colorString('content.primary')

  const onChange = useCallback((next: string | number | null) => onValueChange?.(String(next)), [onValueChange])
  const wheelModifiers = useMemo(
    () => [pickerStyle('wheel'), ...(disabled ? [disabledModifier(true)] : [])],
    [disabled]
  )

  if (insideHost) {
    return (
      <SwiftUIPicker modifiers={wheelModifiers} onSelectionChange={onChange} selection={value} testID={testID}>
        {options.map(option => (
          <SwiftUIText key={option.value} modifiers={[tag(option.value), foregroundStyle(color)]}>
            {option.label}
          </SwiftUIText>
        ))}
      </SwiftUIPicker>
    )
  }

  return (
    <NativePicker enabled={!disabled} onValueChange={onChange} selectedValue={value} testID={testID}>
      {options.map(option => (
        <NativePicker.Item color={color} key={option.value} label={option.label} value={option.value} />
      ))}
    </NativePicker>
  )
}
