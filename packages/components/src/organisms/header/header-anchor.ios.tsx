import {NavigationBarAnchor} from '@hzblj/kara-native/swift-ui'

import type {HeaderAnchorComponent, HeaderAnchorProps} from './header.types'

/**
 * kara-native's `NavigationBarAnchor`: the content is laid out from the top of the screen and shifted under the bar
 * natively, in the same call as the bar moves, with no commit per frame. `HeaderInset` gets the same value through a
 * Fabric commit, rounded to pixels and frames later.
 */
export const HeaderAnchor: HeaderAnchorComponent = ({children}: HeaderAnchorProps) => (
  <NavigationBarAnchor pointerEvents="box-none">{children}</NavigationBarAnchor>
)
