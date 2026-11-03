import type {SearchFieldRef} from '@hzblj/kara-native/jetpack-compose'
import {useImperativeHandle, useRef} from 'react'

import {BAR_SEARCH_ROW_HEIGHT, BarSearchField, BarSearchRow} from '../../molecules/navigation-bar/bar-search-field'
import type {HeaderSearchInputComponent, HeaderSearchInputProps} from './header-search-input.types'

/** The row's height under the bar, for what is laid out below it (the scrim starts there). */
export const HEADER_SEARCH_ROW_HEIGHT = BAR_SEARCH_ROW_HEIGHT

const ignoreDetachedView = () => undefined

export const HeaderSearchInput: HeaderSearchInputComponent = ({
  clearIcon,
  onChangeText,
  onFocusChange,
  placeholder,
  ref,
  voice,
}: HeaderSearchInputProps) => {
  const fieldRef = useRef<SearchFieldRef>(null)

  useImperativeHandle(
    ref,
    () => ({
      blur: () => {
        fieldRef.current?.blurField().catch(ignoreDetachedView)
      },
      clear: () => {
        fieldRef.current?.clearQuery().catch(ignoreDetachedView)
      },
      setText: (text: string) => {
        fieldRef.current?.setQuery(text).catch(ignoreDetachedView)
      },
    }),
    []
  )

  return (
    <BarSearchRow>
      <BarSearchField
        clearIcon={clearIcon}
        onChangeText={onChangeText}
        onFocusChange={onFocusChange}
        placeholder={placeholder}
        ref={fieldRef}
        voice={voice}
      />
    </BarSearchRow>
  )
}
