import type {ReactNode} from 'react'

/** SwiftUI `Slider` / Compose's Material `Slider`, tinted `fill.accent.primary`. */
export type SliderProps = {
  /** Stops the user moving the thumb, and dims the slider. */
  disabled?: boolean
  /** The upper end. `1` by default. */
  max?: number
  /** The lower end. `0` by default. */
  min?: number
  /** Called with the new value as the thumb moves. */
  onValueChange?: (value: number) => void
  /** The increment between stops; leave it unset for a continuous slider. On Android every stop plays a `tick`. */
  step?: number
  /** Between `min` and `max`. Controlled: pass back what `onValueChange` reports. */
  value: number
}

export type SliderComponent = (props: SliderProps) => ReactNode
