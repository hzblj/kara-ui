import {SwipeActions as SwiftUISwipeActions} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {SwipeActionsComponent, SwipeActionsGroupProps, SwipeActionsProps} from './swipe-actions.types'

const SwipeActionsRoot = ({children, testID}: SwipeActionsProps) => {
  useHostGuard('SwipeActions')

  return <SwiftUISwipeActions testID={testID}>{children}</SwiftUISwipeActions>
}

const SwipeActionsGroup = ({allowsFullSwipe = true, children, edge = 'trailing'}: SwipeActionsGroupProps) => (
  <SwiftUISwipeActions.Actions allowsFullSwipe={allowsFullSwipe} edge={edge}>
    {children}
  </SwiftUISwipeActions.Actions>
)

export const SwipeActions: SwipeActionsComponent = Object.assign(SwipeActionsRoot, {Actions: SwipeActionsGroup})
