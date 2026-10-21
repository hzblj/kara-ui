import type {ReactNode} from 'react'

export type SwipeActionsEdge = 'leading' | 'trailing'

/**
 * Swipe-to-reveal buttons on a row. iOS only — Compose ships no equivalent, so on Android the
 * row renders exactly as it would without this wrapper and the action buttons are dropped.
 * Degrading that way rather than to `null` keeps the content on screen.
 */
export type SwipeActionsProps = {
  children: ReactNode
  testID?: string
}

export type SwipeActionsGroupProps = {
  /** Whether swiping all the way performs the first action in the group. */
  allowsFullSwipe?: boolean
  children: ReactNode
  edge?: SwipeActionsEdge
}

export type SwipeActionsComponent = ((props: SwipeActionsProps) => ReactNode) & {
  Actions: (props: SwipeActionsGroupProps) => ReactNode
}
