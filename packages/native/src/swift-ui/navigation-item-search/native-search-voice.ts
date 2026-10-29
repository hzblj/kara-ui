import type {ProcessedColorValue} from 'react-native'

import {type SearchVoiceSizes, searchVoiceColor} from '../../search-voice'
import type {SearchFieldVoiceIOS} from './navigation-item-search.types'

/** What crosses the bridge: the voice without its handlers and meter. */
export type NativeSearchVoiceRecord = {
  clearImageName?: string
  clearLabel?: string
  color?: ProcessedColorValue | null
  enabled: boolean
  listening: boolean
  microphoneImageName?: string
  microphoneLabel?: string
  sizes?: SearchVoiceSizes
  stopImageName?: string
  stopLabel?: string
}

export const toNativeSearchVoice = (voice: SearchFieldVoiceIOS | undefined): NativeSearchVoiceRecord => ({
  clearImageName: voice?.clearImageName,
  clearLabel: voice?.clearLabel,
  color: searchVoiceColor(voice?.color),
  enabled: voice !== undefined,
  listening: voice?.listening ?? false,
  microphoneImageName: voice?.microphoneImageName,
  microphoneLabel: voice?.microphoneLabel,
  sizes: voice?.sizes,
  stopImageName: voice?.stopImageName,
  stopLabel: voice?.stopLabel,
})
