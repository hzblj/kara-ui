import {iconResourceName} from '@hzblj/expo-native-icons'
import {isLiquidGlassAvailable} from '@hzblj/kara-native'
import {NavigationItemMorph} from '@hzblj/kara-native/swift-ui'
import {Fragment} from 'react'

import type {HeaderAction, HeaderOptions, HeaderTextAction} from './header.types'
import {headerColor} from './header-color'
import type {HeaderItemMorphCheck, HeaderItemMorphs} from './header-item-morph.types'

type MorphingAction = HeaderTextAction & Required<Pick<HeaderTextAction, 'collapsedIcon' | 'testID'>>

const isMorphingAction = (action: HeaderAction): action is MorphingAction =>
  action.type === 'text' && action.collapsedIcon !== undefined && action.testID !== undefined

/**
 * A collapsible trailing text action with a `testID` morphs on iOS 26: its bar item keeps the label and
 * `NavigationItemMorph` takes it over by that identifier. Earlier iOS swaps the label for the icon.
 */
export const morphsNatively: HeaderItemMorphCheck = action => isMorphingAction(action) && isLiquidGlassAvailable()

/**
 * Mounts one `NavigationItemMorph` per morphing trailing action through `headerBackground`, the screen's own tree,
 * next to whatever background the options already have (the native subtitle).
 */
export const withHeaderItemMorphs: HeaderItemMorphs = (options, trailingActions, theme) => {
  const morphing: MorphingAction[] = []

  for (const action of trailingActions ?? []) {
    if (morphsNatively(action) && isMorphingAction(action)) {
      morphing.push(action)
    }
  }

  if (morphing.length === 0) {
    return options
  }

  const background = options.headerBackground
  const itemColor = headerColor(theme, 'content.primary')
  const result: HeaderOptions = {}

  Object.assign(result, options)
  result.headerBackground = () => (
    <Fragment>
      {background?.()}
      {morphing.map(action => (
        <NavigationItemMorph
          key={action.testID}
          collapsed={action.collapsed === true}
          imageName={iconResourceName(action.collapsedIcon)}
          itemColor={itemColor}
          itemIdentifier={action.testID}
          label={action.label}
        />
      ))}
    </Fragment>
  )

  return result
}
