import type {TextFieldAutoCapitalize, TextFieldKeyboard} from './text-field.types'

/** Keyboards for an address, where a capital or a correction the user did not type would only break it. */
const ADDRESS_KEYBOARDS: ReadonlySet<TextFieldKeyboard> = new Set(['email', 'url'])

/** The capitalisation asked for, else `none` for an address; `undefined` leaves the platform's own. */
export const capitalizationFor = (
  keyboard: TextFieldKeyboard,
  autoCapitalize: TextFieldAutoCapitalize | undefined
): TextFieldAutoCapitalize | undefined => autoCapitalize ?? (ADDRESS_KEYBOARDS.has(keyboard) ? 'none' : undefined)

/** Autocorrection as asked for, else on for everything but an address. */
export const autoCorrectFor = (keyboard: TextFieldKeyboard, autoCorrect: boolean | undefined): boolean =>
  autoCorrect ?? !ADDRESS_KEYBOARDS.has(keyboard)

/** A no-op for a ref call that lands after the native view has gone. */
export const ignoreDetachedView = () => undefined
