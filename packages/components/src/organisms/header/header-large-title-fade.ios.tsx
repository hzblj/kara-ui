import {LargeTitleFade} from '@hzblj/kara-native/swift-ui'

import type {HeaderLargeTitleFadeComponent, HeaderLargeTitleFadeProps} from './header.types'

/**
 * Fades its content out and back with the large title when the header search opens and closes, in step with UIKit's
 * own animation. Keep the content mounted while searching: a `HeaderInset` moves with the bar's animation, and content
 * mounted into it mid-animation draws off its place until the animation ends.
 */
export const HeaderLargeTitleFade: HeaderLargeTitleFadeComponent = ({children}: HeaderLargeTitleFadeProps) => (
  <LargeTitleFade>{children}</LargeTitleFade>
)
