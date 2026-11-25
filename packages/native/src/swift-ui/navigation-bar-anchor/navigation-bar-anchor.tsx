import type {ReactNode} from 'react'
import type {StyleProp, ViewProps, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

export type NavigationBarAnchorProps = {
  children?: ReactNode
  pointerEvents?: ViewProps['pointerEvents']
  style?: StyleProp<ViewStyle>
}

/**
 * Content at the top of a native-stack screen that sits right under the navigation bar and moves with it natively, in
 * the same frame, also while the header search opens and closes. Laid out as if the bar were not there. The parent
 * must already reach where it ends up, and it suits native controls rather than React Native pressables. iOS only.
 */
export const NavigationBarAnchor = requireKaraView<NavigationBarAnchorProps>('NavigationBarAnchorView')
