import {iconResourceName} from '@hzblj/expo-native-icons'
import {SearchField, type SearchFieldRef} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {type ReactNode, type Ref, useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import type {IconName} from '../../atoms/icon'
import {ComposeHost} from '../../hooks/compose-host'
import type {SearchFieldVoice} from './navigation-bar.types'

/** Material's search field is 56dp; a row adds 8dp above it and 12dp below, under a top app bar. */
const FIELD_HEIGHT = 56

/** A search row's height under a bar, for what is laid out below it. */
export const BAR_SEARCH_ROW_HEIGHT = 8 + FIELD_HEIGHT + 12

const styles = StyleSheet.create({
  field: {height: FIELD_HEIGHT},
  row: {paddingBottom: 12, paddingHorizontal: 16, paddingTop: 8},
})

export type BarSearchFieldProps = {
  /** Focuses the field and shows the keyboard as soon as it is composed. */
  autoFocus?: boolean
  /** The text button beside a focused field that empties and blurs it. `Cancel` by default. */
  cancelLabel?: string
  clearIcon?: IconName
  onChangeText: (text: string) => void
  onFocusChange?: (focused: boolean, hasText: boolean) => void
  placeholder: string
  ref?: Ref<SearchFieldRef>
  testID?: string
  voice?: SearchFieldVoice
}

/**
 * The search field kara draws on Android, in a header row or inside a bar: Material's input field in the theme's
 * colours and body face, with the app's icons and the voice. A Compose view, so the caller brings the host. Import it
 * only from `.android` files.
 */
export const BarSearchField = ({
  autoFocus,
  cancelLabel = 'Cancel',
  clearIcon,
  onChangeText,
  onFocusChange,
  placeholder,
  ref,
  testID,
  voice,
}: BarSearchFieldProps) => {
  const theme = useAppTheme()
  const face = theme.typography.body

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
    <SearchField
      autoFocus={autoFocus}
      cancelLabel={cancelLabel}
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
      ref={ref}
      testID={testID}
      textColor={theme.color('content.primary')}
      voice={nativeVoice}
    />
  )
}

/** A search field's own row under a bar, in its own host. */
export const BarSearchRow = ({children}: {children: ReactNode}) => (
  <View style={styles.row}>
    <ComposeHost ignoreSafeAreaKeyboardInsets style={styles.field}>
      {children}
    </ComposeHost>
  </View>
)
