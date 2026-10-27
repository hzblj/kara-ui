import type {ReactNode, Ref} from 'react'

/** The keyboard a field brings up. */
export type TextFieldKeyboard = 'decimal' | 'default' | 'email' | 'number' | 'phone' | 'url'

/** When the keyboard turns Shift on by itself. */
export type TextFieldAutoCapitalize = 'characters' | 'none' | 'sentences' | 'words'

/** What the return key says. */
export type TextFieldSubmitLabel = 'done' | 'go' | 'next' | 'search' | 'send'

/**
 * What a field holds, so the system can offer to fill it in: an account's email or password, a new strong password,
 * the code from a text message, the user's own name, phone number or address.
 */
export type TextFieldContentType =
  | 'addressCity'
  | 'countryName'
  | 'creditCardNumber'
  | 'emailAddress'
  | 'familyName'
  | 'fullStreetAddress'
  | 'givenName'
  | 'name'
  | 'newPassword'
  | 'oneTimeCode'
  | 'password'
  | 'postalCode'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'telephoneNumber'
  | 'username'

/** Drives a `TextField` from code, as when `onSubmit` moves on to the next field. */
export type TextFieldRef = {
  /** Ends editing: the field gives up focus and the keyboard goes down. */
  blur: () => void
  /** Empties the field and calls `onChangeText` with `''`. */
  clear: () => void
  /** Starts editing: the field takes focus and brings up the keyboard. */
  focus: () => void
}

/**
 * An uncontrolled text field with an optional label above it: SwiftUI `TextField` (`SecureField` when `secure`) /
 * Compose `OutlinedTextField`. `keyboard`, `autoCapitalize`, `autoCorrect` and `contentType` fit it to the text it
 * takes; `submitLabel`, `onSubmit` and `ref` chain fields so the return key moves on to the next.
 */
export type TextFieldProps = {
  /**
   * When the keyboard turns Shift on by itself: never (`none`), at the start of `sentences`, of `words`, or for all
   * `characters`. Unset, it is `none` for the `email` and `url` keyboards, and otherwise each platform's own:
   * `sentences` on iOS, `none` on Android.
   */
  autoCapitalize?: TextFieldAutoCapitalize
  /**
   * Lets the keyboard correct words as they are typed and suggest the next. On unless the keyboard is `email` or
   * `url`, where a correction would only break an address. A `secure` field never corrects.
   */
  autoCorrect?: boolean
  /** Takes focus, and brings up the keyboard, as soon as the field appears. Off by default. */
  autoFocus?: boolean
  /**
   * What the field holds, so the system can offer to fill it in: a saved `username` or `password` from the keychain
   * or a password manager, a strong `newPassword` for a sign-up, the `oneTimeCode` from a text message, the user's own
   * `emailAddress`, `name`, `telephoneNumber` or address. iOS's `textContentType`; on Android a Compose autofill
   * hint, which an autofill service (Google's, a password manager) answers.
   */
  contentType?: TextFieldContentType
  /** The text it starts with. Read once, on mount: the field is uncontrolled. */
  defaultValue?: string
  /** Stops editing and dims the field. On iOS it outranks `error`. */
  disabled?: boolean
  /**
   * Marks the field invalid: a destructive outline and label. A message is shown under the field as well (on Android
   * as Material's supporting text, beside its error icon), so the error never rests on colour alone; Material's error
   * colour is a pale red in dark mode. `true` marks it without a message.
   */
  error?: boolean | string
  /**
   * The keyboard it brings up. `default` by default. `email` and `url` add their `@` and `.` keys and turn
   * capitals and corrections off unless `autoCapitalize` or `autoCorrect` say otherwise; `number` is a pad of digits,
   * `decimal` adds the locale's decimal separator, `phone` is a dial pad. With `secure`, Android brings up its password
   * keyboard (a numeric one for `number`).
   */
  keyboard?: TextFieldKeyboard
  /** Shown above the field, in `labelMedium`. */
  label?: string
  /**
   * The most characters it takes. What is typed past it is cut off as the user types; `defaultValue` is not. No limit
   * by default.
   */
  maxLength?: number
  /** Wraps the text and grows the field to fit it. iOS ignores it when `secure`. */
  multiline?: boolean
  /** Called with the whole text after every change, `clear()` included. */
  onChangeText?: (text: string) => void
  /** Called with `true` when the field starts editing and `false` when it stops. */
  onFocusChange?: (focused: boolean) => void
  /**
   * Called with the whole text when the return key is pressed. A `multiline` field never calls it: its return key
   * starts a new line. Neither do iOS's `number`, `decimal` and `phone` pads, which have no return key.
   */
  onSubmit?: (text: string) => void
  /**
   * Shown in the empty field, in the platform's placeholder colour, until the first character is typed. A hint at
   * the format (`name@example.com`), not a replacement for `label`.
   */
  placeholder?: string
  /** `focus`, `blur` and `clear`, for moving to the next field from `onSubmit`. */
  ref?: Ref<TextFieldRef>
  /** Masks the text, for a password. */
  secure?: boolean
  /**
   * What the return key says. Unset, each platform's own (`return` on iOS). It names the key; what pressing it does
   * is up to `onSubmit`, so a `next` focuses the following field through its `ref`. Android's `next` also moves focus
   * to the next field in the same host by itself. A `multiline` field ignores it: its return key starts a new line.
   */
  submitLabel?: TextFieldSubmitLabel
  /** Test identifier, forwarded to the native field (not the label above it). */
  testID?: string
}

export type TextFieldComponent = (props: TextFieldProps) => ReactNode
