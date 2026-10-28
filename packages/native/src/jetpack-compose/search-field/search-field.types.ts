import type {Ref} from 'react'
import type {ColorValue} from 'react-native'

import type {SearchVoice} from '../../search-voice'

/** A search field's voice on Android, with the app's own icons: drawable resource names. */
export type SearchFieldVoiceAndroid = Omit<SearchVoice, 'clearLabel' | 'color'> & {
  /** kara's microphone glyph by default, `iconResourceName(name)` for an app icon. */
  microphoneIconName?: string
  /** The glyph in the tonal stop button: kara's stop glyph by default, `iconResourceName(name)` for an app icon. */
  stopIconName?: string
}

export type SearchFieldRef = {
  /** Ends editing and hides the keyboard. Rejects once the view is detached. */
  blurField: () => Promise<void>
  /** Empties the field. Rejects once the view is detached. */
  clearQuery: () => Promise<void>
  /** Focuses the field. Rejects once the view is detached. */
  focusField: () => Promise<void>
  /** Replaces the text and puts the cursor at its end. Rejects once the view is detached. */
  setQuery: (text: string) => Promise<void>
}

export type SearchFieldProps = {
  /** The text button that expands next to the field while it is focused or holds text, and clears and blurs it. */
  cancelLabel: string
  /**
   * A drawable resource name for the clear button: kara's close glyph by default, `iconResourceName(name)` for an app
   * icon.
   */
  clearIconName?: string
  /** The clear button's content description. */
  clearLabel: string
  /** The field's pill. */
  containerColor: ColorValue
  /** The face of the field's text, its placeholder and the cancel button. The platform's by default. */
  fontFamily?: string
  /** In sp. */
  fontSize?: number
  /** Tints the search and clear icons. */
  iconColor: ColorValue
  /** In sp. */
  letterSpacing?: number
  /** Called when the field gains or loses focus. */
  onFocusChange?: (isFocused: boolean) => void
  /** Called with the text after every change, typed, cleared or set through the ref. */
  onQueryChange?: (text: string) => void
  /** Called with the text when the keyboard's search action is pressed. The keyboard hides first. */
  onSubmit?: (text: string) => void
  /** Shown while the field is empty. */
  placeholder?: string
  /** The placeholder's colour. */
  placeholderColor: ColorValue
  /** `clearQuery`, `setQuery`, `focusField` and `blurField`. */
  ref?: Ref<SearchFieldRef>
  /**
   * A drawable resource name for the leading icon: kara's search glyph by default, `iconResourceName(name)` for an app
   * icon.
   */
  searchIconName?: string
  /** Becomes the input field's test tag. */
  testID?: string
  /** The field's text, its cursor and the cancel button's label. */
  textColor: ColorValue
  /**
   * Makes it a whole search header: a large title above the field, which collapses with the `toolbarHeight` spacer
   * above it while the field is focused or holds text, so the field slides up to the top.
   */
  title?: string
  /** `textColor` by default. */
  titleColor?: ColorValue
  /** The title's face. The platform's by default. */
  titleFontFamily?: string
  /** In sp. */
  titleFontSize?: number
  /** In sp. */
  titleLetterSpacing?: number
  /** In dp. Room left above the title for a toolbar drawn over it, collapsed together with the title. */
  toolbarHeight?: number
  /**
   * A microphone while the field is empty, the clear button in its place once it holds text, and a live waveform with a
   * tonal stop button while listening. Tinted by `iconColor`.
   */
  voice?: SearchFieldVoiceAndroid
}
