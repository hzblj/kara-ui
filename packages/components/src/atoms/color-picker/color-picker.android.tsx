import {warnUnsupported} from '../../platform-support'
import type {ColorPickerComponent} from './color-picker.types'

/** Compose has no colour picker, and there is nothing sane to degrade a colour wheel into. */
export const ColorPicker: ColorPickerComponent = () => {
  warnUnsupported('ColorPicker', 'Android')

  return null
}
