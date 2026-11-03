import {useCallback} from 'react'
import type {ColorValue, ViewStyle} from 'react-native'

import {GLYPHS} from '../../glyphs'
import {requireKaraView} from '../../require-view'
import {type SearchVoiceActionEvent, type SearchVoiceSizes, sharedObjectId} from '../../search-voice'
import type {NavigationItemSearchProps} from './navigation-item-search.types'

type NativeNavigationItemSearchProps = {
  clearIconName?: string
  iconColor?: ColorValue
  microphoneIconName?: string
  microphoneLabel?: string
  onVoiceAction: (event: SearchVoiceActionEvent) => void
  rippleColor?: ColorValue
  stopContainerColor?: ColorValue
  stopIconName?: string
  stopLabel?: string
  style: ViewStyle
  voiceEnabled: boolean
  voiceListening: boolean
  voiceMeter: number | null
  voiceSizes?: SearchVoiceSizes
}

const HIDDEN_STYLE: ViewStyle = {height: 0, position: 'absolute', width: 0}

const NativeNavigationItemSearch = requireKaraView<NativeNavigationItemSearchProps>('NavigationItemSearchView')

/**
 * Dresses react-native-screens' toolbar search, the Android side of a header's `integratedButton` search: a microphone
 * in the field with a live waveform and a stop button while listening (`voice`), the X kept in the toolbar's corner
 * with the bar's icon ripple and the app's glyph. Mount it anywhere in the screen's tree; it takes no room. Not a
 * Compose view: it needs no host.
 */
export const NavigationItemSearch = ({voice, ...props}: NavigationItemSearchProps) => {
  const onStart = voice?.onStart
  const onStop = voice?.onStop
  const handleVoiceAction = useCallback(
    (event: SearchVoiceActionEvent) => (event.nativeEvent.action === 'start' ? onStart?.() : onStop?.()),
    [onStart, onStop]
  )

  return (
    <NativeNavigationItemSearch
      {...props}
      microphoneIconName={voice?.microphoneIconName ?? GLYPHS.microphone.android}
      microphoneLabel={voice?.microphoneLabel}
      onVoiceAction={handleVoiceAction}
      stopIconName={voice?.stopIconName ?? GLYPHS.stop.android}
      stopLabel={voice?.stopLabel}
      style={HIDDEN_STYLE}
      voiceEnabled={voice !== undefined}
      voiceListening={voice?.listening ?? false}
      voiceMeter={sharedObjectId(voice?.meter)}
      voiceSizes={voice?.sizes}
    />
  )
}
