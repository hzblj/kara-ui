import type {SearchVoiceMeter} from '@hzblj/kara-native'
import type {ReactNode, Ref} from 'react'
import type {ColorValue} from 'react-native'

import type {IconName} from '../../atoms/icon'

/**
 * A search field's voice: a microphone while the field is empty, the clear button in its place once it holds text, and
 * while `listening` a live waveform of `meter` beside a stop button. Nothing records here: the app runs the dictation
 * (`@hzblj/expo-speech`'s `SpeechTranscriber`, whose `Transcription` is the `meter`, or anything else) and writes what
 * it hears into the field through the search's `setText`. The icons are the app's; unset, the platform's glyphs.
 */
export type SearchFieldVoice = {
  /** The clear button that takes the microphone's place once the field holds text. */
  clearIcon?: IconName
  /** The clear button's accessibility label. */
  clearLabel?: string
  /** Tints the microphone, the clear button, the waveform and the stop glyph (iOS). The bar's item colour by default. */
  color?: ColorValue
  /** Dictation is running: the waveform and the stop button replace the microphone. */
  listening: boolean
  /**
   * The transcription to draw, a native shared object that posts its level (`@hzblj/expo-speech`'s `Transcription`), so
   * no level crosses to JavaScript. Without one the waveform stays flat.
   */
  meter?: SearchVoiceMeter | null
  /** The microphone. */
  microphoneIcon?: IconName
  /** The microphone's accessibility label. */
  microphoneLabel: string
  /** The search ended while listening (cancelled, or typed over): drop the dictation. */
  onCancel?: () => void
  /** The microphone was pressed. The field is focused first, so the search opens as if typed into. */
  onStart: () => void
  /** The stop button was pressed. */
  onStop: () => void
  /** The glyph in the stop button. */
  stopIcon?: IconName
  /** The stop button's accessibility label. */
  stopLabel: string
}

type NavigationBarItemBase = {
  /** Called when the item is pressed. */
  onPress: () => void
  /**
   * iOS 26: neighbouring items on one side share a glass capsule; this gives the item its own. A close next to
   * actions usually wants it. Material has no grouped capsules, so Android ignores it.
   */
  separated?: boolean
  /** iOS: the item's accessibility identifier; Android: its test tag. */
  testID?: string
}

/**
 * One item of the bar. `back` and `close` are the platform's own (a chevron and the system close item on iOS, the
 * Material arrow and cross on Android), with `Back` / `Close` as their labels unless given others; on iOS `icon` puts
 * one of the app's icons in place of the system glyph. An `icon` item is one of the app's icons and names itself for
 * VoiceOver and TalkBack.
 */
export type NavigationBarItem =
  | (NavigationBarItemBase & {icon?: IconName; label?: string; type: 'back' | 'close'})
  | (NavigationBarItemBase & {icon: IconName; label: string; type: 'icon'})

export type NavigationBarSearchRef = {
  /** Empties the field and ends editing. */
  clear: () => void
  /** Sets the field's text without `onChangeText`, the way dictation fills it in. */
  setText: (text: string) => void
}

/**
 * Where the search field goes on iOS, as a native-stack header places its search: `stacked` in a row of its own under
 * the title, `integratedButton` as a search item beside the trailing items that turns the bar into the field.
 */
export type NavigationBarSearchPlacement = 'integratedButton' | 'stacked'

/**
 * A search field in the bar. iOS only for now; Android keeps the title. A focused field gets a cancel item that
 * empties it and ends the search, a bar item like the others.
 */
export type NavigationBarSearch = {
  /** `integratedButton`: the search item's icon, one of the app's icons; the system magnifying glass unset. */
  buttonIcon?: IconName
  /** `integratedButton`: the search item's label for VoiceOver. `Search` by default. */
  buttonLabel?: string
  /** The cancel item's icon, one of the app's icons; the system cross unset. */
  cancelIcon?: IconName
  /** The cancel item's label for VoiceOver. `Cancel` by default. */
  cancelLabel?: string
  /** The field's clear button, one of the app's icons; the system's unset. */
  clearIcon?: IconName
  /** Every edit of the field's text. */
  onChangeText: (text: string) => void
  /** The field gained or lost focus. */
  onFocusChange?: (focused: boolean) => void
  /** Shown while the field is empty. */
  placeholder: string
  /** `stacked` (a row under the title) by default. */
  placement?: NavigationBarSearchPlacement
  /** Imperative `clear`. */
  ref?: Ref<NavigationBarSearchRef>
  /** Test identifier, forwarded to the native search field. */
  testID?: string
  /** A microphone in the field: see `SearchFieldVoice`. */
  voice?: SearchFieldVoice
}

export type NavigationBarTitleAlignment = 'center' | 'leading'

/**
 * A title with items on either side, for a header that is not a navigation screen's. `Sheet.Header` is built on it.
 * On iOS a standalone `UINavigationBar`, so the items press and render exactly like a native-stack header's: on iOS 26
 * neighbours share a glass capsule instead of swelling as standalone glass buttons do. On Android Material's top app
 * bar. Where an item goes is the caller's choice: the bar places nothing by itself, so a close can sit on either side.
 * The React Native tier: it needs no host.
 */
export type NavigationBarProps = {
  /** Light items and title, for a bar laid over an image or a dark hero. */
  inverted?: boolean
  /** In screen order, from the leading edge. */
  leadingItems?: NavigationBarItem[]
  /** A search field (iOS): under the title, or behind a search item beside the trailing items. */
  search?: NavigationBarSearch
  /** Test identifier, forwarded to the native bar. iOS only; Android ignores it. */
  testID?: string
  /** The bar's title. */
  title?: string
  /** `center` (iOS's own) by default; `leading` is Material's top app bar. */
  titleAlignment?: NavigationBarTitleAlignment
  /** Fades the title out and in without moving the items, for a large title that scrolls under the bar. */
  titleVisible?: boolean
  /** In screen order, toward the trailing edge. */
  trailingItems?: NavigationBarItem[]
}

export type NavigationBarComponent = (props: NavigationBarProps) => ReactNode
