import {Host} from '@expo/ui/jetpack-compose'
import {SearchField, type SearchFieldRef} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useImperativeHandle, useRef} from 'react'
import {StyleSheet, View} from 'react-native'

import type {HeaderSearchInputComponent, HeaderSearchInputProps} from './header-search-input.types'

/** Material's search field is 56dp; the row adds 8dp above it and 12dp below, under the top app bar. */
const FIELD_HEIGHT = 56

/** The row's height under the bar, for what is laid out below it (the scrim starts there). */
export const HEADER_SEARCH_ROW_HEIGHT = 8 + FIELD_HEIGHT + 12

const styles = StyleSheet.create({
  field: {height: FIELD_HEIGHT},
  row: {paddingBottom: 12, paddingHorizontal: 16, paddingTop: 8},
})

const ignoreDetachedView = () => undefined

export const HeaderSearchInput: HeaderSearchInputComponent = ({
  onChangeText,
  onFocusChange,
  placeholder,
  ref,
}: HeaderSearchInputProps) => {
  const theme = useAppTheme()
  const fieldRef = useRef<SearchFieldRef>(null)
  const face = theme.typography.body

  useImperativeHandle(
    ref,
    () => ({
      blur: () => {
        fieldRef.current?.blurField().catch(ignoreDetachedView)
      },
      clear: () => {
        fieldRef.current?.clearQuery().catch(ignoreDetachedView)
      },
    }),
    []
  )

  return (
    <View style={styles.row}>
      <Host
        colorScheme={theme.dark ? 'dark' : 'light'}
        ignoreSafeAreaKeyboardInsets
        seedColor={theme.materialSeed}
        style={styles.field}
      >
        <SearchField
          cancelLabel="Cancel"
          clearLabel="Clear"
          containerColor={theme.color('fill.quaternary')}
          fontFamily={face.fontFamily}
          fontSize={face.fontSize}
          iconColor={theme.color('content.secondary')}
          onFocusChange={onFocusChange}
          onQueryChange={onChangeText}
          placeholder={placeholder}
          placeholderColor={theme.color('content.tertiary')}
          ref={fieldRef}
          textColor={theme.color('content.primary')}
        />
      </Host>
    </View>
  )
}
