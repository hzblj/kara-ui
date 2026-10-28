import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useRef, useState} from 'react'
import {Platform} from 'react-native'
import type {SearchBarCommands} from 'react-native-screens'

import type {HeaderSearch, HeaderSearchBarOptions, HeaderSearchParams, HeaderSearchPlacement} from './header.types'
import {headerColor} from './header-color'
import {HeaderSearchAccessory} from './header-search-accessory'
import {HEADER_SEARCH_ROW_HEIGHT, HeaderSearchInput} from './header-search-input'
import type {HeaderSearchInputRef} from './header-search-input.types'
import {HeaderSearchScrim} from './header-search-scrim'

/** `integratedButton` hides the title and items while the field is open and keeps it out of the bottom toolbar. */
const PLACEMENT_OPTIONS: Record<HeaderSearchPlacement, Partial<HeaderSearchBarOptions>> = {
  integratedButton: {allowToolbarIntegration: false, hideNavigationBar: true},
  stacked: {hideNavigationBar: false},
}

/**
 * A search field for a screen's header. iOS: UIKit's search bar stacked under the title, with the title and items kept
 * and nothing dimmed by the system, so a list can filter live, or behind a search button in the bar's corner
 * (`placement`); pass `searchBar` to `useHeader` as `search`. Android: Material's search field with its cancel button,
 * as a row for the screen to put right under the top app bar (`searchInput`). Both report the `query`; `scrim` washes
 * the content out while the field is focused and empty and, on iOS, carries the field's glyphs and voice.
 *
 * With `voice` the field has a microphone; the app runs the dictation and writes what it hears with `setText`. Typing
 * over it, or ending the search, calls `voice.onCancel`.
 */
export const useHeaderSearch = ({
  cancelIcon,
  clearIcon,
  enabled = true,
  placeholder = 'Search',
  placement = 'stacked',
  voice,
}: HeaderSearchParams = {}): HeaderSearch => {
  const theme = useAppTheme()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const searchBarRef = useRef<SearchBarCommands | null>(null)
  const inputRef = useRef<HeaderSearchInputRef>(null)
  const lastSetText = useRef<string | null>(null)
  const voiceRef = useRef(voice)

  voiceRef.current = voice

  const cancelVoice = useCallback(() => {
    if (voiceRef.current?.listening) {
      voiceRef.current.onCancel?.()
    }
  }, [])

  const changeQuery = useCallback(
    (text: string) => {
      if (text !== lastSetText.current) {
        cancelVoice()
      }
      setQuery(text)
    },
    [cancelVoice]
  )

  const reset = useCallback(() => {
    cancelVoice()
    lastSetText.current = null
    setQuery('')
    setFocused(false)
  }, [cancelVoice])

  const searchBar = useMemo((): HeaderSearchBarOptions | undefined => {
    if (!enabled || Platform.OS !== 'ios') {
      return undefined
    }

    return {
      ...PLACEMENT_OPTIONS[placement],
      autoCapitalize: 'none',
      hideWhenScrolling: false,
      obscureBackground: false,
      onBlur: () => setFocused(false),
      onCancelButtonPress: reset,
      onChangeText: event => changeQuery(event.nativeEvent.text),
      onFocus: () => setFocused(true),
      placeholder,
      placement,
      ref: searchBarRef,
      tintColor: headerColor(theme, 'content.primary'),
    }
  }, [changeQuery, enabled, placeholder, placement, reset, theme])

  const searchInput = useMemo(() => {
    if (!enabled || Platform.OS !== 'android') {
      return null
    }

    return (
      <HeaderSearchInput
        clearIcon={clearIcon}
        onChangeText={changeQuery}
        onFocusChange={setFocused}
        placeholder={placeholder}
        ref={inputRef}
        voice={voice}
      />
    )
  }, [changeQuery, clearIcon, enabled, placeholder, voice])

  const clear = useCallback(() => {
    reset()
    searchBarRef.current?.cancelSearch()
    inputRef.current?.clear()
    inputRef.current?.blur()
  }, [reset])

  const setText = useCallback((text: string) => {
    lastSetText.current = text
    setQuery(text)
    searchBarRef.current?.setText(text)
    inputRef.current?.setText(text)
  }, [])

  const dimmed = enabled && focused && query.trim().length === 0

  const scrim = useMemo(() => {
    if (!enabled) {
      return null
    }

    return (
      <>
        {dimmed ? <HeaderSearchScrim onPress={clear} topOffset={HEADER_SEARCH_ROW_HEIGHT} /> : null}
        <HeaderSearchAccessory cancelIcon={cancelIcon} clearIcon={clearIcon} voice={voice} />
      </>
    )
  }, [cancelIcon, clear, clearIcon, dimmed, enabled, voice])

  return {clear, query, scrim, searchBar, searchInput, setText}
}
