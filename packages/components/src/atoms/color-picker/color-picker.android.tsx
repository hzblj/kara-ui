import {ColorWell} from '@hzblj/kara-native/jetpack-compose'

import {useHostGuard} from '../../host-context'
import {HStack} from '../h-stack'
import {Spacer} from '../spacer'
import {Text} from '../text'
import type {ColorPickerComponent, ColorPickerProps} from './color-picker.types'

/**
 * The row SwiftUI's `ColorPicker` lays out on iOS, the label leading and the well trailing, around kara's own Compose
 * well: Compose ships no colour picker, so the sheet behind it draws the iOS picker's grid, spectrum and sliders.
 * `disabled` dims the label and the well, which then does not open its sheet.
 */
export const ColorPicker: ColorPickerComponent = ({
  disabled = false,
  label,
  onValueChange,
  supportsOpacity = false,
  testID,
  value,
}: ColorPickerProps) => {
  useHostGuard('ColorPicker')

  return (
    <HStack align="center" spacing="s12" testID={testID} wide>
      {label ? <Text color={disabled ? 'content.tertiary' : undefined}>{label}</Text> : null}
      <Spacer />
      <ColorWell
        enabled={!disabled}
        onValueChange={onValueChange}
        supportsOpacity={supportsOpacity}
        title={label}
        value={value}
      />
    </HStack>
  )
}
