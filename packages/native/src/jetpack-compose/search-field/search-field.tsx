import {useCallback} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {GLYPHS} from '../../glyphs'
import {requireKaraView} from '../../require-view'
import {type SearchVoiceActionEvent, type SearchVoiceSizes, sharedObjectId} from '../../search-voice'
import type {SearchFieldProps} from './search-field.types'

type TextEvent = NativeSyntheticEvent<{text: string}>

type FocusChangeEvent = NativeSyntheticEvent<{isFocused: boolean}>

type NativeSearchFieldProps = Omit<
  SearchFieldProps,
  'onFocusChange' | 'onQueryChange' | 'onSubmit' | 'testID' | 'voice'
> & {
  fieldTestID?: string
  microphoneIconName?: string
  microphoneLabel?: string
  onQueryChange: (event: TextEvent) => void
  onSearchFocusChange: (event: FocusChangeEvent) => void
  onSearchSubmit: (event: TextEvent) => void
  onVoiceAction: (event: SearchVoiceActionEvent) => void
  stopIconName?: string
  stopLabel?: string
  voiceEnabled: boolean
  voiceListening: boolean
  voiceMeter: number | null
  voiceSizes?: SearchVoiceSizes
}

const NativeSearchField = requireKaraView<NativeSearchFieldProps>('SearchFieldView')

/**
 * Material 3's search input field with autocorrect off and a cancel button that expands next to it while it is in use.
 * With `title`, a whole search header whose large title collapses while the field is active. A Compose view: it
 * renders inside a host.
 */
export const SearchField = ({
  clearIconName = GLYPHS.close.android,
  onFocusChange,
  onQueryChange,
  onSubmit,
  searchIconName = GLYPHS.search.android,
  testID,
  voice,
  ...props
}: SearchFieldProps) => {
  const handleQueryChange = useCallback((event: TextEvent) => onQueryChange?.(event.nativeEvent.text), [onQueryChange])

  const handleFocusChange = useCallback(
    (event: FocusChangeEvent) => onFocusChange?.(event.nativeEvent.isFocused),
    [onFocusChange]
  )

  const handleSubmit = useCallback((event: TextEvent) => onSubmit?.(event.nativeEvent.text), [onSubmit])

  const onVoiceStart = voice?.onStart
  const onVoiceStop = voice?.onStop
  const handleVoiceAction = useCallback(
    (event: SearchVoiceActionEvent) => (event.nativeEvent.action === 'start' ? onVoiceStart?.() : onVoiceStop?.()),
    [onVoiceStart, onVoiceStop]
  )

  return (
    <NativeSearchField
      {...props}
      clearIconName={clearIconName}
      fieldTestID={testID}
      microphoneIconName={voice?.microphoneIconName ?? GLYPHS.microphone.android}
      microphoneLabel={voice?.microphoneLabel}
      onQueryChange={handleQueryChange}
      onSearchFocusChange={handleFocusChange}
      onSearchSubmit={handleSubmit}
      onVoiceAction={handleVoiceAction}
      searchIconName={searchIconName}
      stopIconName={voice?.stopIconName ?? GLYPHS.stop.android}
      stopLabel={voice?.stopLabel}
      voiceEnabled={voice !== undefined}
      voiceListening={voice?.listening ?? false}
      voiceMeter={sharedObjectId(voice?.meter)}
      voiceSizes={voice?.sizes}
    />
  )
}
