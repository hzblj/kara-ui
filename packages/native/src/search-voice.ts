import type {SharedObject} from 'expo'
import {type ColorValue, processColor} from 'react-native'

/**
 * A live transcription a search field's waveform follows natively: any shared object that posts its level the way
 * `@hzblj/expo-speech`'s `Transcription` does (the `expo.audioLevel` notification on iOS, an audio level listener on
 * Android), so no level crosses to JavaScript.
 */
export type SearchVoiceMeter = InstanceType<SharedObject>

/**
 * What a search field's voice controls measure, in points (dp on Android). Each size left out keeps the platform's own:
 * the glyphs their own size (an app icon's, or the system's), a 26 pt stop button on iOS and Material's 40 dp tonal one
 * on Android, and a 64 × 20 waveform of 2 pt bars 2 pt apart.
 */
export type SearchVoiceSizes = {
  /** The clear button's glyph, fitted into a square this big. */
  clearIconSize?: number
  /** The microphone's glyph, fitted into a square this big. */
  microphoneIconSize?: number
  /** The stop button's circle. */
  stopButtonSize?: number
  /** The live waveform while listening. */
  waveform?: {
    barGap?: number
    /** Half of `barWidth` unset, so the bars have round ends; 0 makes them flat. */
    barRadius?: number
    barWidth?: number
    height?: number
    minBarHeight?: number
    width?: number
  }
}

/**
 * A search field's voice. Nothing records here: the field shows a microphone while it is empty, reports a press as
 * `onStart`, and while `listening` draws `meter` as a live waveform beside a stop button that reports `onStop`. The app
 * runs the dictation (`@hzblj/expo-speech`, or anything else) and writes what it hears into the field.
 */
export type SearchVoice = {
  /** The clear button's accessibility label: it takes the microphone's place once the field holds text. */
  clearLabel?: string
  /** Tints the microphone, the clear button, the waveform and the stop glyph. The label colour by default. */
  color?: ColorValue
  /** Dictation is running: the waveform and the stop button replace the microphone. */
  listening: boolean
  /** The transcription to draw. Without one the waveform stays flat. */
  meter?: SearchVoiceMeter | null
  /** The microphone's accessibility label. */
  microphoneLabel: string
  /** The microphone was pressed. The field is focused first, so a search opens as if typed into. */
  onStart: () => void
  /** The stop button was pressed. */
  onStop: () => void
  /** The glyphs, the stop button and the waveform, each the platform's own size unless set. */
  sizes?: SearchVoiceSizes
  /** The stop button's accessibility label. */
  stopLabel: string
}

/** A search field's voice event, as the native views send it. */
export type SearchVoiceActionEvent = {nativeEvent: {action: 'start' | 'stop'}}

/**
 * A shared object goes to a native view prop by its id: Fabric cannot carry the JavaScript object, and a prop that got
 * the object itself arrived as nothing.
 */
export const sharedObjectId = (object: SearchVoiceMeter | null | undefined): number | null => {
  const id: unknown = object ? Reflect.get(object, '__expo_shared_object_id__') : undefined
  return typeof id === 'number' ? id : null
}

export const searchVoiceColor = (color: ColorValue | undefined) =>
  color === undefined ? undefined : processColor(color)
