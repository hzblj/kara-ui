import type {ReactNode} from 'react'

export type SheetGrabberProps = {
  /** Shows the grabber. `true` by default. */
  visible?: boolean
}

export type SheetGrabberComponent = (props: SheetGrabberProps) => ReactNode
