import {Column, Text as ComposeText, OutlinedTextField, useNativeState} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {Glyph} from '../../glyph'
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
  const invalid = Boolean(error)
  const message = typeof error === 'string' && error ? error : undefined

  return (
    <Column verticalArrangement={{spacedBy: 4}}>
      {label ? (
        <ComposeText
          color={theme.colorString(invalid ? 'content.destructive' : 'content.secondary')}
          style={theme.typography.labelMedium}
        >
          {label}
        </ComposeText>
      ) : null}
      <OutlinedTextField
        enabled={!disabled}
        isError={invalid}
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
      >
        {invalid ? (
          <OutlinedTextField.TrailingIcon>
            <Glyph color="content.destructive" name="error" />
          </OutlinedTextField.TrailingIcon>
        ) : null}
        {message ? (
          <OutlinedTextField.SupportingText>
            <ComposeText color={theme.colorString('content.destructive')} style={theme.typography.footnote}>
              {message}
            </ComposeText>
          </OutlinedTextField.SupportingText>
        ) : null}
      </OutlinedTextField>
    </Column>
  )
}
