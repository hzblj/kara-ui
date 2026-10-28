import {useCallback} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {GLYPHS} from '../../glyphs'
import {requireKaraView} from '../../require-view'
import type {SearchFieldProps} from './search-field.types'

type TextEvent = NativeSyntheticEvent<{text: string}>

type FocusChangeEvent = NativeSyntheticEvent<{isFocused: boolean}>

type NativeSearchFieldProps = Omit<SearchFieldProps, 'onFocusChange' | 'onQueryChange' | 'onSubmit' | 'testID'> & {
  fieldTestID?: string
  onQueryChange: (event: TextEvent) => void
  onSearchFocusChange: (event: FocusChangeEvent) => void
  onSearchSubmit: (event: TextEvent) => void
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
  ...props
}: SearchFieldProps) => {
  const handleQueryChange = useCallback((event: TextEvent) => onQueryChange?.(event.nativeEvent.text), [onQueryChange])

  const handleFocusChange = useCallback(
    (event: FocusChangeEvent) => onFocusChange?.(event.nativeEvent.isFocused),
    [onFocusChange]
  )

  const handleSubmit = useCallback((event: TextEvent) => onSubmit?.(event.nativeEvent.text), [onSubmit])

  return (
    <NativeSearchField
      {...props}
      clearIconName={clearIconName}
      fieldTestID={testID}
      onQueryChange={handleQueryChange}
      onSearchFocusChange={handleFocusChange}
      onSearchSubmit={handleSubmit}
      searchIconName={searchIconName}
    />
  )
}
