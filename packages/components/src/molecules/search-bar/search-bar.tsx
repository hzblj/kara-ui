import {useAppTheme} from '@hzblj/kara-theme'
import {TextInput} from 'react-native'

import {Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnGlyph} from '../../glyph'
import type {SearchBarComponent, SearchBarProps} from './search-bar.types'

export const SearchBar: SearchBarComponent = ({
  onChangeText,
  placeholder = 'Search',
  testID,
  value,
}: SearchBarProps) => {
  const theme = useAppTheme()

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
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color('content.quaternary')}
        style={[theme.typography.body, {color: theme.color('content.primary'), flex: 1, padding: 0}]}
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
