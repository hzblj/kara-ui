import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

type NativeInlineLargeTitleProps = {
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeInlineLargeTitle = requireKaraView<NativeInlineLargeTitleProps>('InlineLargeTitleView')

/**
 * iOS 17: the screen's large title on the leading side of the bar row, level with the bar items, as in the Apple TV
 * app, instead of in a row of its own under the bar. The screen needs `headerLargeTitleEnabled`. Mount it anywhere in
 * the screen's tree outside a SwiftUI host; it takes no room (`display: contents`). Earlier iOS ignores it.
 */
export const InlineLargeTitle = () => <NativeInlineLargeTitle disableForceFlatten style={CONTENTS_STYLE} />
