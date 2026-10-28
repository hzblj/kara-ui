import {ColorPicker as SwiftUIColorPicker} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, labelsHidden, opacity as opacityModifier} from '@expo/ui/swift-ui/modifiers'
import {opacity} from '@hzblj/kara-theme'

import {useHostGuard} from '../../hooks/host-context'
import {HStack} from '../h-stack'
import {Spacer} from '../spacer'
import {Text} from '../text'
import type {ColorPickerComponent, ColorPickerProps} from './color-picker.types'

// iOS 27 stops a disabled picker but draws its label and well at full strength: the label is then kara's own text,
// dimmed, and the well takes the opacity.
const DISABLED = [labelsHidden(), disabledModifier(true), opacityModifier(opacity.o40)]

export const ColorPicker: ColorPickerComponent = ({
  disabled = false,
  label,
  onValueChange,
  supportsOpacity = false,
  testID,
  value,
}: ColorPickerProps) => {
  useHostGuard('ColorPicker')

  const picker = (
    <SwiftUIColorPicker
      label={label}
      modifiers={disabled ? DISABLED : undefined}
      onSelectionChange={onValueChange}
      selection={value}
      supportsOpacity={supportsOpacity}
      testID={testID}
    />
  )

  if (!disabled) {
    return picker
  }

  return (
    <HStack align="center" spacing="s12" wide>
      {label ? <Text color="content.tertiary">{label}</Text> : null}
      <Spacer />
      {picker}
    </HStack>
  )
}
