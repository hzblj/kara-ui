import {useCallback, useMemo} from 'react'
import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import {type SearchVoiceActionEvent, sharedObjectId} from '../../search-voice'
import {type NativeSearchVoiceRecord, toNativeSearchVoice} from './native-search-voice'
import type {NavigationItemSearchProps} from './navigation-item-search.types'

type NativeNavigationItemSearchProps = Omit<NavigationItemSearchProps, 'voice'> & {
  disableForceFlatten: boolean
  onVoiceAction: (event: SearchVoiceActionEvent) => void
  style: ViewStyle
  voice: NativeSearchVoiceRecord
  voiceMeter: number | null
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeNavigationItemSearch = requireKaraView<NativeNavigationItemSearchProps>('NavigationItemSearchView')

/**
 * Dresses the search bar react-native-screens puts on the screen's navigation item: the app's clear and cancel glyphs,
 * a microphone with a live waveform and a stop button (`voice`), and a search the integrated search's system close ends
 * is reported like a cancel, so the query empties. Mount it anywhere in the screen's tree; it takes no room. iOS only.
 */
export const NavigationItemSearch = ({voice, ...props}: NavigationItemSearchProps) => {
  const nativeVoice = useMemo(() => toNativeSearchVoice(voice), [voice])
  const onStart = voice?.onStart
  const onStop = voice?.onStop
  const handleVoiceAction = useCallback(
    (event: SearchVoiceActionEvent) => (event.nativeEvent.action === 'start' ? onStart?.() : onStop?.()),
    [onStart, onStop]
  )

  return (
    <NativeNavigationItemSearch
      {...props}
      disableForceFlatten
      onVoiceAction={handleVoiceAction}
      style={CONTENTS_STYLE}
      voice={nativeVoice}
      voiceMeter={sharedObjectId(voice?.meter)}
    />
  )
}
