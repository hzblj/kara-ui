import {ColorPicker as SwiftUIColorPicker} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {ColorPickerComponent, ColorPickerProps} from './color-picker.types'

export const ColorPicker: ColorPickerComponent = ({
  label,
  onValueChange,
  supportsOpacity = false,
  testID,
  value,
}: ColorPickerProps) => {
  useHostGuard('ColorPicker')

  return (
    <SwiftUIColorPicker
      label={label}
      onSelectionChange={onValueChange}
      selection={value}
      supportsOpacity={supportsOpacity}
      testID={testID}
    />
  )
}
