import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {TextInput} from 'react-native'

import {Box} from '../../atoms/box'
import {Icon} from '../../atoms/icon'
import {Island} from '../../atoms/island'
import {Pressable} from '../../atoms/pressable'
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
      <Island style={{height: spacing.s20, width: spacing.s20}}>
        <Icon color="content.tertiary" name="search" size="s20" />
      </Island>
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color('content.quaternary')}
        style={[theme.typography.body, {color: theme.color('content.primary'), flex: 1, padding: 0}]}
        value={value}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText?.('')}>
          <Island style={{height: spacing.s20, width: spacing.s20}}>
            <Icon color="content.tertiary" name="close" size="s20" />
          </Island>
        </Pressable>
      ) : null}
    </Box>
  )
}
