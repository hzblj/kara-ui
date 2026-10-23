import type {ReactNode} from 'react'

/**
 * An uncontrolled text field with an optional label above it — SwiftUI `TextField` (`SecureField` when `secure`) /
 * Compose `OutlinedTextField`.
 */
export type TextFieldProps = {
  /** The text it starts with. Read once, on mount — the field is uncontrolled. */
  defaultValue?: string
  /** Stops editing and dims the field. On iOS it outranks `error`. */
  disabled?: boolean
  /**
   * Marks the field invalid: a destructive outline and label. A message is shown under the field as well — on Android
   * as Material's supporting text, beside its error icon — so the error never rests on colour alone; Material's error
   * colour is a pale red in dark mode. `true` marks it without a message.
   */
  error?: boolean | string
  /** Shown above the field, in `labelMedium`. */
  label?: string
  /** Wraps the text and grows the field to fit it. iOS ignores it when `secure`. */
  multiline?: boolean
  /** Called with the whole text after every change. */
  onChangeText?: (text: string) => void
  /** Masks the text, for a password. */
  secure?: boolean
  /** iOS: forwarded to the native field. Android ignores it. */
  testID?: string
}

export type TextFieldComponent = (props: TextFieldProps) => ReactNode
