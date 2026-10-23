import {SecureField, TextField as SwiftUITextField, useNativeState, VStack} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, textFieldStyle} from '@expo/ui/swift-ui/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {type ColorToken, spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {Text} from '../text'
import type {TextFieldComponent, TextFieldProps} from './text-field.types'

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
  defaultValue = '',
  disabled = false,
  error = false,
  label,
  multiline = false,
  onChangeText,
  secure = false,
  testID,
}: TextFieldProps) => {
  useHostGuard('TextField')
  const text = useNativeState(defaultValue)
  const tone = TONE[toneOf(disabled, Boolean(error))]
  const message = tone === TONE.error && typeof error === 'string' && error ? error : undefined

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

    return list
  }, [disabled, sxModifiers])

  return (
    <VStack alignment="leading" spacing={spacing.s4}>
      {label ? (
        <Text color={tone.label} variant="labelMedium">
          {label}
        </Text>
      ) : null}
      {secure ? (
        <SecureField modifiers={modifiers} onTextChange={onChangeText} testID={testID} text={text} />
      ) : (
        <SwiftUITextField
          axis={multiline ? 'vertical' : 'horizontal'}
          modifiers={modifiers}
          onTextChange={onChangeText}
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
