import {
  SecureField,
  TextField as SwiftUITextField,
  type TextFieldRef as SwiftUITextFieldRef,
  useNativeState,
  VStack,
} from '@expo/ui/swift-ui'
import {
  autocorrectionDisabled,
  disabled as disabledModifier,
  keyboardType,
  onSubmit as onSubmitModifier,
  submitLabel as submitLabelModifier,
  textContentType,
  textFieldStyle,
  textInputAutocapitalization,
} from '@expo/ui/swift-ui/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {type ColorToken, spacing} from '@hzblj/kara-theme'
import {useImperativeHandle, useMemo, useRef} from 'react'
import {useHostGuard} from '../../host-context'
import {Text} from '../text'
import type {TextFieldAutoCapitalize, TextFieldComponent, TextFieldKeyboard, TextFieldProps} from './text-field.types'
import {autoCorrectFor, capitalizationFor, ignoreDetachedView} from './text-field-input'

type FieldTone = 'default' | 'disabled' | 'error'

type FieldToneColors = {
  bg: ColorToken
  border: ColorToken
  label: ColorToken
}

const TONE = {
  default: {bg: 'surface.primary', border: 'border.secondary.muted', label: 'content.secondary'},
  disabled: {bg: 'surface.depth', border: 'border.quinary', label: 'content.quaternary'},
  error: {bg: 'surface.primary', border: 'border.destructive', label: 'content.destructive'},
} as const satisfies Record<FieldTone, FieldToneColors>

/** UIKit's keyboards. `number` is the digits-only pad, which, like `decimal` and `phone`, has no return key. */
const KEYBOARD = {
  decimal: 'decimal-pad',
  default: 'default',
  email: 'email-address',
  number: 'numeric',
  phone: 'phone-pad',
  url: 'url',
} as const satisfies Record<TextFieldKeyboard, Parameters<typeof keyboardType>[0]>

const CAPITALIZATION = {
  characters: 'characters',
  none: 'never',
  sentences: 'sentences',
  words: 'words',
} as const satisfies Record<TextFieldAutoCapitalize, Parameters<typeof textInputAutocapitalization>[0]>

/**
 * Disabled outranks error — a field nobody can edit should recede rather than shout. `.disabled` only
 * dims the text, so the chrome has to carry the state itself.
 */
const toneOf = (disabled: boolean, error: boolean): FieldTone => {
  if (disabled) {
    return 'disabled'
  }

  return error ? 'error' : 'default'
}

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
  const text = useNativeState(defaultValue)
  // One handle for either field: `SecureFieldRef` is `TextFieldRef` without the selection.
  const field = useRef<SwiftUITextFieldRef>(null)
  const tone = TONE[toneOf(disabled, Boolean(error))]
  const message = tone === TONE.error && typeof error === 'string' && error ? error : undefined
  const capitalization = capitalizationFor(keyboard, autoCapitalize)
  const corrects = autoCorrectFor(keyboard, autoCorrect)
  // A `SecureField` is one line whatever `multiline` says; a vertical `TextField`'s return key starts a new line.
  const singleLine = secure || !multiline

  useImperativeHandle(
    ref,
    () => ({
      blur: () => field.current?.blur().catch(ignoreDetachedView),
      // Neither field reports a text set from code, so the change is reported here.
      clear: () => {
        field.current?.clear().catch(ignoreDetachedView)
        onChangeText?.('')
      },
      focus: () => field.current?.focus().catch(ignoreDetachedView),
    }),
    [onChangeText]
  )

  const sxModifiers = useSxModifiers({
    bg: tone.bg,
    borderColor: tone.border,
    borderRadius: 'small',
    borderWidth: 1,
    px: 's12',
    py: 's8',
    wide: true,
  })

  const modifiers = useMemo(() => {
    const list = [textFieldStyle('plain'), ...sxModifiers]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    if (keyboard !== 'default') {
      list.push(keyboardType(KEYBOARD[keyboard]))
    }

    if (capitalization) {
      list.push(textInputAutocapitalization(CAPITALIZATION[capitalization]))
    }

    if (!corrects) {
      list.push(autocorrectionDisabled(true))
    }

    if (contentType) {
      list.push(textContentType(contentType))
    }

    if (singleLine && submitLabel) {
      list.push(submitLabelModifier(submitLabel))
    }

    if (singleLine && onSubmit) {
      // `onSubmit` reports no text, so it is read off the field's state, which the typing has already written.
      list.push(onSubmitModifier(() => onSubmit(text.get())))
    }

    return list
  }, [capitalization, contentType, corrects, disabled, keyboard, onSubmit, singleLine, submitLabel, sxModifiers, text])

  return (
    <VStack alignment="leading" spacing={spacing.s4}>
      {label ? (
        <Text color={tone.label} variant="labelMedium">
          {label}
        </Text>
      ) : null}
      {secure ? (
        <SecureField
          autoFocus={autoFocus}
          maxLength={maxLength}
          modifiers={modifiers}
          onFocusChange={onFocusChange}
          onTextChange={onChangeText}
          placeholder={placeholder}
          ref={field}
          testID={testID}
          text={text}
        />
      ) : (
        <SwiftUITextField
          autoFocus={autoFocus}
          axis={multiline ? 'vertical' : 'horizontal'}
          maxLength={maxLength}
          modifiers={modifiers}
          onFocusChange={onFocusChange}
          onTextChange={onChangeText}
          placeholder={placeholder}
          ref={field}
          testID={testID}
          text={text}
        />
      )}
      {message ? (
        <Text color="content.destructive" variant="footnote">
          {message}
        </Text>
      ) : null}
    </VStack>
  )
}
