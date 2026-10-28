import type {SearchVoice} from '../../search-voice'

/** A search field's voice on iOS, with the app's own glyphs: asset-catalog image names, drawn as templates. */
export type SearchFieldVoiceIOS = SearchVoice & {
  /** The clear button that takes the microphone's place once the field holds text. `xmark.circle.fill` unset. */
  clearImageName?: string
  /** `mic` unset. */
  microphoneImageName?: string
  /** The glyph in the stop circle. `stop.fill` unset. */
  stopImageName?: string
}

export type NavigationItemSearchProps = {
  /**
   * The cancel circle beside a focused stacked field (iOS 26): an asset-catalog image, drawn as a template. The
   * integrated search's close (`integratedButton`) has no API for one and stays the system's.
   */
  cancelImageName?: string
  /** The field's own clear button, without `voice`: an asset-catalog image, drawn in the secondary label colour. */
  clearImageName?: string
  /** A microphone in the field, a waveform and a stop button while listening. */
  voice?: SearchFieldVoiceIOS
}
