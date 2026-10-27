import type {ReactNode} from 'react'

/** One choice of a `RadioGroup`. */
export type RadioOption = {
  /** The option's text. */
  label: string
  /** Identifies the option to `value` and `onValueChange`, and keys its row. Keep it unique. */
  value: string
}

/**
 * A single choice from a list: rows with a checkmark on the selected one on iOS, Material radio buttons on Android. A
 * native atom: it renders inside `<Screen>` or `<Island>`.
 */
export type RadioGroupProps = {
  /** Stops the user changing the selection, and dims the options. */
  disabled?: boolean
  /** The user pressed an option; it passes that option's `value`. */
  onValueChange?: (value: string) => void
  /** The choices, top to bottom. */
  options: RadioOption[]
  /** Test identifier, on the whole group. Reach an option by its label. */
  testID?: string
  /** The selected option's `value`. Update it from `onValueChange`. */
  value: string
}

export type RadioGroupComponent = (props: RadioGroupProps) => ReactNode
