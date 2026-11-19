import {Button, Image, Label, SwipeActions as SwiftUISwipeActions} from '@expo/ui/swift-ui'
import {tint} from '@expo/ui/swift-ui/modifiers'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {configureSwipeActionAppearance} from '@hzblj/kara-native'
import {useAppTheme} from '@hzblj/kara-theme'
import {useEffect} from 'react'

import {useHostGuard} from '../../hooks/host-context'
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

/**
 * SwiftUI has no API for a swipe action's title or icon colour, so they follow the theme the way Android's ripple
 * follows `fill.ripple`: the title `content.secondary`, the icon `content.on.accent`, or `content.on.destructive` on a
 * `fill.destructive.primary` capsule. The appearance is global (iOS 26+), set again only when the theme changes.
 */
const useSwipeActionAppearance = () => {
  const theme = useAppTheme()

  useEffect(() => {
    configureSwipeActionAppearance({
      destructiveBackgroundColor: {light: theme.color('fill.destructive.primary')},
      destructiveIconColor: {light: theme.color('content.on.destructive')},
      iconColor: {light: theme.color('content.on.accent')},
      titleColor: {light: theme.color('content.secondary')},
    })
  }, [theme])
}

export const SwipeActions: SwipeActionsComponent = ({
  allowsFullSwipe = true,
  children,
  leading = [],
  testID,
  trailing = [],
}: SwipeActionsProps) => {
  useHostGuard('SwipeActions')
  useSwipeActionAppearance()

  return (
    <SwiftUISwipeActions testID={testID}>
      {children}
      {leading.length > 0 ? <Actions actions={leading} allowsFullSwipe={allowsFullSwipe} edge="leading" /> : null}
      {trailing.length > 0 ? <Actions actions={trailing} allowsFullSwipe={allowsFullSwipe} edge="trailing" /> : null}
    </SwiftUISwipeActions>
  )
}
