import type {ReactNode} from 'react'

/**
 * The system colour picker. iOS only — Compose ships no equivalent, so on Android this
 * renders nothing and says so in dev. Branch on `Platform.OS` if the screen needs a fallback.
 */
export type ColorPickerProps = {
  label?: string
  onValueChange?: (color: string) => void
  supportsOpacity?: boolean
  testID?: string
  /** `#RRGGBB` or `#RRGGBBAA`. */
  value: string | null
}

export type ColorPickerComponent = (props: ColorPickerProps) => ReactNode
