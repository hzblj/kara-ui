import {Column, Text as ComposeText, OutlinedTextField, useNativeState} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import type {TextFieldComponent, TextFieldProps} from './text-field.types'

export const TextField: TextFieldComponent = ({
  defaultValue = '',
  disabled = false,
  error = false,
  label,
  multiline = false,
  onChangeText,
  secure = false,
}: TextFieldProps) => {
  useHostGuard('TextField')
  const theme = useAppTheme()
  const value = useNativeState(defaultValue)
  const modifiers = useSxModifiers({wide: true})

  return (
    <Column verticalArrangement={{spacedBy: 4}}>
      {label ? (
        <ComposeText
          color={theme.colorString(error ? 'content.destructive' : 'content.secondary')}
          style={theme.typography.labelMedium}
        >
          {label}
        </ComposeText>
      ) : null}
      <OutlinedTextField
        enabled={!disabled}
        isError={error}
        modifiers={modifiers}
        onValueChange={onChangeText}
        singleLine={!multiline}
        textStyle={{
          color: theme.colorString('content.primary'),
          fontFamily: theme.typography.body.fontFamily,
          fontWeight: theme.typography.body.fontWeight,
        }}
        value={value}
        visualTransformation={secure ? 'password' : 'none'}
      />
    </Column>
  )
}
