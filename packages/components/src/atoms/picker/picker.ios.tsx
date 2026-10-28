import {Picker as NativePicker} from '@expo/ui/community/picker'
import {Host, Picker as SwiftUIPicker, Text as SwiftUIText} from '@expo/ui/swift-ui'
import {
  disabled as disabledModifier,
  foregroundStyle,
  pickerStyle as pickerStyleModifier,
  tag,
  tint,
} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../hooks/host-context'
import type {PickerComponent, PickerProps} from './picker.types'

/**
 * A SwiftUI picker: a wheel, or with `pickerStyle="menu"` a button with the selection that opens the options as a
 * menu, in the accent. On its own the wheel is `@expo/ui`'s community picker, which brings a host of its own, and the
 * menu sits in a host sized to its button on both axes, as the date picker's pill does, so it drops into a row the way
 * a `Text` does. Inside a `Screen` or `Island` either renders into that host instead (see `useInsideHost`): a host
 * nested in the island's stack is given no height there, and the wheel spills over the views around it.
 */
export const Picker: PickerComponent = ({
  disabled = false,
  onValueChange,
  options,
  pickerStyle = 'wheel',
  testID,
  value,
}: PickerProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const color = theme.colorString('content.primary')
  const menu = pickerStyle === 'menu'

  const onChange = useCallback((next: string | number | null) => onValueChange?.(String(next)), [onValueChange])
  const modifiers = useMemo(
    () => [
      pickerStyleModifier(pickerStyle),
      ...(menu ? [tint(theme.color('fill.accent.primary'))] : []),
      ...(disabled ? [disabledModifier(true)] : []),
    ],
    [disabled, menu, pickerStyle, theme]
  )

  const picker = (
    <SwiftUIPicker modifiers={modifiers} onSelectionChange={onChange} selection={value} testID={testID}>
      {options.map(option => (
        <SwiftUIText key={option.value} modifiers={[tag(option.value), foregroundStyle(color)]}>
          {option.label}
        </SwiftUIText>
      ))}
    </SwiftUIPicker>
  )

  if (insideHost) {
    return picker
  }

  if (menu) {
    return (
      <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents>
        {picker}
      </Host>
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
