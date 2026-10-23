import type {ReactNode} from 'react'

/** SwiftUI `Toggle` / Compose `Switch`, tinted `fill.accent.primary`. */
export type SwitchProps = {
  /** Stops the user flipping it, and dims it. */
  disabled?: boolean
  /**
   * Shown beside the switch. On Android it makes a full-width row (label at the start, switch at the end) that
   * toggles wherever it is tapped.
   */
  label?: string
  /** Called with the new value when the user flips it. On Android a flip plays `toggleOn` / `toggleOff`. */
  onValueChange?: (value: boolean) => void
  /** Whether it is on. Controlled: pass back what `onValueChange` reports. */
  value: boolean
}

export type SwitchComponent = (props: SwitchProps) => ReactNode
