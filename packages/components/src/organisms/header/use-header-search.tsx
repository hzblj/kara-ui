import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useRef, useState} from 'react'
import {Platform} from 'react-native'
import type {SearchBarCommands} from 'react-native-screens'

import type {HeaderSearch, HeaderSearchBarOptions, HeaderSearchParams} from './header.types'
import {headerColor} from './header-color'
import {HEADER_SEARCH_ROW_HEIGHT, HeaderSearchInput} from './header-search-input'
import type {HeaderSearchInputRef} from './header-search-input.types'
import {HeaderSearchScrim} from './header-search-scrim'

/**
 * A search field for a screen's header. iOS: UIKit's search bar stacked under the title, with the title and items kept
 * and nothing dimmed by the system, so a list can filter live; pass `searchBar` to `useHeader` as `search`. Android:
 * Material's search field with its cancel button, as a row for the screen to put right under the top app bar
 * (`searchInput`). Both report the `query`; `scrim` washes the content out while the field is focused and empty.
 */
export const useHeaderSearch = ({enabled = true, placeholder = 'Search'}: HeaderSearchParams = {}): HeaderSearch => {
  const theme = useAppTheme()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const searchBarRef = useRef<SearchBarCommands | null>(null)
  const inputRef = useRef<HeaderSearchInputRef>(null)

  const searchBar = useMemo((): HeaderSearchBarOptions | undefined => {
    if (!enabled || Platform.OS !== 'ios') {
      return undefined
    }

    return {
      autoCapitalize: 'none',
      hideNavigationBar: false,
      hideWhenScrolling: false,
      obscureBackground: false,
      onBlur: () => setFocused(false),
      onCancelButtonPress: () => {
        setQuery('')
        setFocused(false)
      },
      onChangeText: event => setQuery(event.nativeEvent.text),
      onFocus: () => setFocused(true),
      placeholder,
      placement: 'stacked',
      ref: searchBarRef,
      tintColor: headerColor(theme, 'content.primary'),
    }
  }, [enabled, placeholder, theme])

  const searchInput = useMemo(() => {
    if (!enabled || Platform.OS !== 'android') {
      return null
    }

    return (
      <HeaderSearchInput onChangeText={setQuery} onFocusChange={setFocused} placeholder={placeholder} ref={inputRef} />
    )
  }, [enabled, placeholder])

  const clear = useCallback(() => {
    setQuery('')
    searchBarRef.current?.cancelSearch()
    inputRef.current?.clear()
    inputRef.current?.blur()
  }, [])

  const dimmed = enabled && focused && query.trim().length === 0

  const scrim = useMemo(
    () => (dimmed ? <HeaderSearchScrim onPress={clear} topOffset={HEADER_SEARCH_ROW_HEIGHT} /> : null),
    [clear, dimmed]
  )

  return {clear, query, scrim, searchBar, searchInput}
}
