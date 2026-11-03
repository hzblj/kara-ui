import type {ColorValue} from 'react-native'

import type {SearchFieldVoiceAndroid} from '../search-field/search-field.types'

export type NavigationItemSearchProps = {
  /** The toolbar field's X (clear, or close when empty): a drawable resource name. appcompat's own unset. */
  clearIconName?: string
  /** Tints the microphone, the waveform and the stop glyph. The toolbar's content colour unset. */
  iconColor?: ColorValue
  /** The press ripple of the X and the voice buttons, as on the bar's other icons. Material's own unset. */
  rippleColor?: ColorValue
  /** The tonal stop button's container. Material's own unset. */
  stopContainerColor?: ColorValue
  /** A microphone in the field, a waveform and a stop button while listening. */
  voice?: SearchFieldVoiceAndroid
}
