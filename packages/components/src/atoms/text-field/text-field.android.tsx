import {
  Column,
  Text as ComposeText,
  type TextFieldRef as ComposeTextFieldRef,
  OutlinedTextField,
  type TextFieldKeyboardActions,
  type TextFieldKeyboardOptions,
  type TextFieldKeyboardType,
  useNativeState,
} from '@expo/ui/jetpack-compose'
import {semantics, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useImperativeHandle, useMemo, useRef} from 'react'
import {Glyph} from '../../glyph'
import {useHostGuard} from '../../host-context'
import type {TextFieldComponent, TextFieldContentType, TextFieldKeyboard, TextFieldProps} from './text-field.types'
import {autoCorrectFor, capitalizationFor, ignoreDetachedView} from './text-field-input'

const KEYBOARD = {
  decimal: 'decimal',
  default: 'text',
  email: 'email',
  number: 'number',
  phone: 'phone',
  url: 'uri',
} as const satisfies Record<TextFieldKeyboard, TextFieldKeyboardType>

/**
 * A `secure` field asks for the password keyboards: they suggest nothing and learn nothing, and they are what Android's
 * autofill takes for a password field.
 */
const SECURE_KEYBOARD = {
  ...KEYBOARD,
  default: 'password',
  number: 'numberPassword',
} as const satisfies Record<TextFieldKeyboard, TextFieldKeyboardType>

/** Compose's autofill `ContentType`s, by the hint names `@expo/ui`'s `semantics` modifier maps to them. */
const AUTOFILL_HINT = {
  addressCity: 'postal-address-locality',
  countryName: 'country',
  creditCardNumber: 'cc-number',
  emailAddress: 'email',
  familyName: 'family-name',
  fullStreetAddress: 'street-address',
  givenName: 'given-name',
  name: 'name',
  newPassword: 'new-password',
  oneTimeCode: 'one-time-code',
  password: 'password',
  postalCode: 'postal-code',
  streetAddressLine1: 'address-line1',
  streetAddressLine2: 'address-line2',
  telephoneNumber: 'tel',
  username: 'username',
} as const satisfies Record<TextFieldContentType, string>

export const TextField: TextFieldComponent = ({
  autoCapitalize,
  autoCorrect,
  autoFocus = false,
  contentType,
  defaultValue = '',
  disabled = false,
  error = false,
  keyboard = 'default',
  label,
  maxLength,
  multiline = false,
  onChangeText,
  onFocusChange,
  onSubmit,
  placeholder,
  ref,
  secure = false,
  submitLabel,
  testID,
}: TextFieldProps) => {
  useHostGuard('TextField')
  const theme = useAppTheme()
  const value = useNativeState(defaultValue)
  const field = useRef<ComposeTextFieldRef>(null)
  const sxModifiers = useSxModifiers({wide: true})
  const invalid = Boolean(error)
  const message = typeof error === 'string' && error ? error : undefined
  const face = {fontFamily: theme.typography.body.fontFamily, fontWeight: theme.typography.body.fontWeight}
  const capitalization = capitalizationFor(keyboard, autoCapitalize) ?? 'none'
  const corrects = !secure && autoCorrectFor(keyboard, autoCorrect)
  const singleLine = !multiline
  const submits = singleLine && Boolean(onSubmit)

  useImperativeHandle(
    ref,
    () => ({
      blur: () => field.current?.blur().catch(ignoreDetachedView),
      // The field reports no text set from code, so the change is reported here.
      clear: () => {
        field.current?.clear().catch(ignoreDetachedView)
        onChangeText?.('')
      },
      focus: () => field.current?.focus().catch(ignoreDetachedView),
    }),
    [onChangeText]
  )

  const modifiers = useMemo(
    () => [
      ...sxModifiers,
      ...(testID ? [testIdModifier(testID)] : []),
      ...(contentType ? [semantics({contentType: AUTOFILL_HINT[contentType]})] : []),
    ],
    [contentType, sxModifiers, testID]
  )

  /**
   * A multiline field keeps the default action, a return key that starts a new line. A single-line one asked for
   * `onSubmit` without a `submitLabel` gets `done`: Compose only runs the keyboard action it was given.
   */
  const keyboardOptions = useMemo<TextFieldKeyboardOptions>(
    () => ({
      autoCorrectEnabled: corrects,
      capitalization,
      imeAction: singleLine ? (submitLabel ?? (submits ? 'done' : 'default')) : 'default',
      keyboardType: (secure ? SECURE_KEYBOARD : KEYBOARD)[keyboard],
    }),
    [capitalization, corrects, keyboard, secure, singleLine, submitLabel, submits]
  )

  // Only the action matching `imeAction` ever fires, so each one is the submit.
  const keyboardActions = useMemo<TextFieldKeyboardActions | undefined>(
    () =>
      submits && onSubmit
        ? {onDone: onSubmit, onGo: onSubmit, onNext: onSubmit, onSearch: onSubmit, onSend: onSubmit}
        : undefined,
    [onSubmit, submits]
  )

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
        autoFocus={autoFocus}
        enabled={!disabled}
        isError={invalid}
        keyboardActions={keyboardActions}
        keyboardOptions={keyboardOptions}
        maxLength={maxLength}
        modifiers={modifiers}
        onFocusChanged={onFocusChange}
        onValueChange={onChangeText}
        ref={field}
        singleLine={singleLine}
        textStyle={{color: theme.colorString('content.primary'), ...face}}
        value={value}
        visualTransformation={secure ? 'password' : 'none'}
      >
        {placeholder ? (
          // No colour of its own: Material's placeholder colour comes down to it, dimmed with the field.
          <OutlinedTextField.Placeholder>
            <ComposeText style={face}>{placeholder}</ComposeText>
          </OutlinedTextField.Placeholder>
        ) : null}
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
