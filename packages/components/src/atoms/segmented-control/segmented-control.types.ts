import type {ReactNode} from 'react'

/**
 * A row of mutually exclusive segments, the selected one in the accent — kara's own `UISegmentedControl` on iOS,
 * Material's single-choice segmented buttons on Android. It needs no `Screen` or `Island`: iOS is a plain view, Android
 * brings its own host. It takes the width it is given; the height is the platform's.
 */
export type SegmentedControlProps = {
  /** Stops the user changing the segment, and dims the control. */
  disabled?: boolean
  /**
   * Called with the index and label of the segment the user picked — never for a tap on the one already selected.
   * Android plays `selection`; iOS's control plays its own feedback.
   */
  onChange?: (index: number, value: string) => void
  /** The selected segment. Controlled: pass back what `onChange` reports. */
  selectedIndex: number
  /** Test identifier, on the whole control — reach a segment by its label. */
  testID?: string
  /** The segments' labels, in order. */
  values: string[]
}

export type SegmentedControlComponent = (props: SegmentedControlProps) => ReactNode
