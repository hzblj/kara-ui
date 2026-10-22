import type {ReactNode} from 'react'

/**
 * The system colour picker. iOS only — Compose ships no equivalent, so on Android this
 * renders nothing and says so in dev. Branch on `Platform.OS` if the screen needs a fallback.
 */
export type ColorPickerProps = {
  /** Text beside the colour well. */
  label?: string
  /** Called with the colour the user picks. */
  onValueChange?: (color: string) => void
  /** Lets the user pick an opacity as well. Off by default. */
  supportsOpacity?: boolean
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** `#RRGGBB` or `#RRGGBBAA`. */
  value: string | null
}

export type ColorPickerComponent = (props: ColorPickerProps) => ReactNode
