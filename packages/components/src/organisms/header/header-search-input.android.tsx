import {Host} from '@expo/ui/jetpack-compose'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {SearchField, type SearchFieldRef} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useImperativeHandle, useMemo, useRef} from 'react'
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
  clearIcon,
  onChangeText,
  onFocusChange,
  placeholder,
  ref,
  voice,
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
      setText: (text: string) => {
        fieldRef.current?.setQuery(text).catch(ignoreDetachedView)
      },
    }),
    []
  )

  const nativeVoice = useMemo(
    () =>
      voice && {
        ...voice,
        microphoneIconName: voice.microphoneIcon ? iconResourceName(voice.microphoneIcon) : undefined,
        stopIconName: voice.stopIcon ? iconResourceName(voice.stopIcon) : undefined,
      },
    [voice]
  )
  const fieldClearIcon = voice?.clearIcon ?? clearIcon

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
          clearIconName={fieldClearIcon ? iconResourceName(fieldClearIcon) : undefined}
          clearLabel={voice?.clearLabel ?? 'Clear'}
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
          voice={nativeVoice}
        />
      </Host>
    </View>
  )
}
