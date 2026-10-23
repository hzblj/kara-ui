import type {ReactNode} from 'react'

/**
 * A search field drawn the same on both platforms: a rounded box with a magnifier, a `TextInput` and a clear button
 * while there is text. The React Native tier: it needs no host.
 */
export type SearchBarProps = {
  /** Every edit, and `''` when the clear button is pressed. */
  onChangeText?: (text: string) => void
  /** Shown while the field is empty. `Search` by default. */
  placeholder?: string
  /** Test identifier, put on the field's container view rather than on the `TextInput`. */
  testID?: string
  /** The field's text. Controlled: pass back what `onChangeText` reports. */
  value: string
}

export type SearchBarComponent = (props: SearchBarProps) => ReactNode
