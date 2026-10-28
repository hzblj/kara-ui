import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {NavigationItemSubtitleProps} from './navigation-item-subtitle.types'

type NativeNavigationItemSubtitleProps = NavigationItemSubtitleProps & {
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeNavigationItemSubtitle = requireKaraView<NativeNavigationItemSubtitleProps>('NavigationItemSubtitleView')

/**
 * iOS 26: the screen's title on the leading side with a subtitle under it, UIKit's own (`style = .browser` and
 * `attributedSubtitle` on the screen's navigation item), so the two truncate and morph between screens natively. Mount
 * it anywhere in the screen's tree; it takes no room (`display: contents`). Earlier iOS ignores it.
 */
export const NavigationItemSubtitle = (props: NavigationItemSubtitleProps) => (
  <NativeNavigationItemSubtitle {...props} disableForceFlatten style={CONTENTS_STYLE} />
)
