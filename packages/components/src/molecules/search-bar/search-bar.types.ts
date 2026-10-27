import type {ReactNode} from 'react'

import type {TextFieldAutoCapitalize} from '../../atoms/text-field'

/**
 * A search field drawn the same on both platforms: a rounded box with a magnifier, a `TextInput` and a clear button
 * while there is text. The keyboard's return key reads Search, and a query is taken as typed: no capitals and no
 * corrections unless asked for. The React Native tier: it needs no host.
 */
export type SearchBarProps = {
  /** When the keyboard turns Shift on by itself. `none` by default: a query is not a sentence. */
  autoCapitalize?: TextFieldAutoCapitalize
  /** Lets the keyboard correct words as they are typed. Off by default, so a query is searched as typed. */
  autoCorrect?: boolean
  /** Takes focus, and brings up the keyboard, as soon as the field appears. Off by default. */
  autoFocus?: boolean
  /** Every edit, and `''` when the clear button is pressed. */
  onChangeText?: (text: string) => void
  /** Called with the query when the keyboard's Search key is pressed. The keyboard goes down after it. */
  onSubmit?: (text: string) => void
  /** Shown while the field is empty. `Search` by default. */
  placeholder?: string
  /** Test identifier, put on the field's container view rather than on the `TextInput`. */
  testID?: string
  /** The field's text. Controlled: pass back what `onChangeText` reports. */
  value: string
}

export type SearchBarComponent = (props: SearchBarProps) => ReactNode
