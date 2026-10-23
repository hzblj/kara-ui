import type {ReactNode} from 'react'

/**
 * A row with a label and a colour well that opens a picker: SwiftUI's `ColorPicker` on iOS. Compose ships none, so on
 * Android it is kara's own, in the same shape: a well with a rainbow ring, and a sheet with a grid of swatches, a
 * spectrum and RGB sliders.
 */
export type ColorPickerProps = {
  /** Text beside the colour well, and the Android sheet's title. */
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
