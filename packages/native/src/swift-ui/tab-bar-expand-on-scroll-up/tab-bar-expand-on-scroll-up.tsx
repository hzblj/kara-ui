import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

type NativeTabBarExpandOnScrollUpProps = {
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeTabBarExpandOnScrollUp = requireKaraView<NativeTabBarExpandOnScrollUpProps>('TabBarExpandOnScrollUpView')

/**
 * iOS 26: expands a tab bar minimized by `onScrollDown` as soon as the content is dragged back up, with UIKit's own
 * animation, instead of only at the top of the list. Mount it once inside the tabs or next to them; it takes no room
 * (`display: contents`). Earlier iOS ignores it.
 */
export const TabBarExpandOnScrollUp = () => <NativeTabBarExpandOnScrollUp disableForceFlatten style={CONTENTS_STYLE} />
