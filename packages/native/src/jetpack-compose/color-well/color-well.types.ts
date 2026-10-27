import type {ReactNode} from 'react'

export type ColorWellProps = {
  /** Off, the well dims and does not open the sheet. On by default. */
  enabled?: boolean
  /** Called with every colour the sheet picks, as `#RRGGBB`, or `#RRGGBBAA` with `supportsOpacity`. */
  onValueChange?: (value: string) => void
  /** Adds the sheet's opacity slider, and the alpha to the reported colour. */
  supportsOpacity?: boolean
  /** The sheet's title, and the well's accessibility label. `Colour` by default. */
  title?: string
  /** `#RRGGBB` or `#RRGGBBAA`. The sheet starts from it; while it is open, the sheet's own colour leads. */
  value?: string | null
}

export type ColorWellComponent = (props: ColorWellProps) => ReactNode
