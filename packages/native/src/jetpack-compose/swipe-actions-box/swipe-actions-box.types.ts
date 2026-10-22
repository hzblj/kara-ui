import type {ReactNode} from 'react'

export type SwipeActionsBoxEdge = 'leading' | 'trailing'

export type SwipeActionsBoxProps = {
  /** Between the actions and the box's own edge, in dp. */
  actionsInset?: number
  /** Between the actions and the row once it is open, in dp. */
  actionsSpacing?: number
  /** The row, and a `SwipeActionsBox.Leading` and/or `SwipeActionsBox.Trailing` slot with what each edge uncovers. */
  children: ReactNode
  /** A drag or a tap settled the row: open at an edge, or closed (`null`). */
  onOpenChange: (edge: SwipeActionsBoxEdge | null) => void
  /** Controlled: the edge the row is open at, `null` closed. */
  openEdge: SwipeActionsBoxEdge | null
}
