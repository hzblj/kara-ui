import {Button, Image, Label, SwipeActions as SwiftUISwipeActions} from '@expo/ui/swift-ui'
import {tint} from '@expo/ui/swift-ui/modifiers'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {SwipeAction, SwipeActionsComponent, SwipeActionsProps} from './swipe-actions.types'

type ActionsProps = {actions: SwipeAction[]; allowsFullSwipe: boolean; edge: 'leading' | 'trailing'}

/**
 * The edge's buttons, a `Label` each — iOS 26 draws its icon on a round button with the title under it; earlier
 * versions, in a row of the usual height, the icon alone. No `destructive` role: SwiftUI would animate the row out by itself, and whether it goes is
 * the list's data to say.
 */
const Actions = ({actions, allowsFullSwipe, edge}: ActionsProps) => {
  const theme = useAppTheme()

  return (
    <SwiftUISwipeActions.Actions allowsFullSwipe={allowsFullSwipe} edge={edge}>
      {actions.map(action => (
        <Button
          key={action.label}
          modifiers={[
            tint(theme.color(action.tint ?? (action.destructive ? 'fill.destructive.primary' : 'fill.accent.primary'))),
          ]}
          onPress={action.onPress}
        >
          <Label icon={<Image assetName={iconResourceName(action.icon)} />} title={action.label} />
        </Button>
      ))}
    </SwiftUISwipeActions.Actions>
  )
}

export const SwipeActions: SwipeActionsComponent = ({
  allowsFullSwipe = true,
  children,
  leading = [],
  testID,
  trailing = [],
}: SwipeActionsProps) => {
  useHostGuard('SwipeActions')

  return (
    <SwiftUISwipeActions testID={testID}>
      {children}
      {leading.length > 0 ? <Actions actions={leading} allowsFullSwipe={allowsFullSwipe} edge="leading" /> : null}
      {trailing.length > 0 ? <Actions actions={trailing} allowsFullSwipe={allowsFullSwipe} edge="trailing" /> : null}
    </SwiftUISwipeActions>
  )
}
