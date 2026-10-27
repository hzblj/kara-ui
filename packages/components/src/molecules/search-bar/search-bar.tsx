import {useAppTheme} from '@hzblj/kara-theme'
import {Platform, TextInput} from 'react-native'

import {Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnGlyph} from '../../glyph'
import type {SearchBarComponent, SearchBarProps} from './search-bar.types'

export const SearchBar: SearchBarComponent = ({
  autoCapitalize = 'none',
  autoCorrect = false,
  autoFocus = false,
  onChangeText,
  onSubmit,
  placeholder = 'Search',
  testID,
  value,
}: SearchBarProps) => {
  const theme = useAppTheme()
  const {lineHeight, ...face} = theme.typography.body
  /**
   * A single-line `UITextField` sets its text against the bottom of a line taller than the font, so the variant's
   * `lineHeight` pushed the text below the magnifier beside it. iOS takes the face without it, in a field as tall as
   * the line would have been; Android centres the line and keeps it.
   */
  const text = Platform.OS === 'ios' ? {...face, height: lineHeight} : theme.typography.body

  return (
    <Box
      align="center"
      bg="fill.quaternary"
      borderRadius="medium"
      flexDirection="row"
      gap="s8"
      px="s12"
      py="s8"
      testID={testID}
      wide
    >
      <RnGlyph color="content.tertiary" name="search" size="s20" />
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit ? event => onSubmit(event.nativeEvent.text) : undefined}
        placeholder={placeholder}
        placeholderTextColor={theme.color('content.quaternary')}
        returnKeyType="search"
        style={[text, {color: theme.color('content.primary'), flex: 1, padding: 0}]}
        value={value}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText?.('')}>
          <RnGlyph color="content.tertiary" name="close" size="s20" />
        </Pressable>
      ) : null}
    </Box>
  )
}
