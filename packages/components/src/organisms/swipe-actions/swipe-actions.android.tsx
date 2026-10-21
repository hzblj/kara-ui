import {warnUnsupported} from '../../platform-support'
import type {SwipeActionsComponent, SwipeActionsProps} from './swipe-actions.types'

/** Passes the row straight through, so losing the gesture never costs you the content. */
const SwipeActionsRoot = ({children}: SwipeActionsProps) => {
  warnUnsupported('SwipeActions', 'Android')

  return children
}

/** The buttons belong to a gesture that does not exist here, so they are dropped. */
const SwipeActionsGroup = () => null

export const SwipeActions: SwipeActionsComponent = Object.assign(SwipeActionsRoot, {Actions: SwipeActionsGroup})
