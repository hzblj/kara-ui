import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {NavigationItemMorphProps} from './navigation-item-morph.types'

type NativeNavigationItemMorphProps = NavigationItemMorphProps & {
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeNavigationItemMorph = requireKaraView<NativeNavigationItemMorphProps>('NavigationItemMorphView')

/**
 * iOS 26: morphs one of the screen's right bar items between its label and an icon in a circle as `collapsed` changes.
 * The label fades, the item's glass stretches a little and springs into the circle, and the icon scales in; a press
 * still swells the glass and reaches the item's own handler. Mount it anywhere in the screen's tree (`display:
 * contents`); it finds the item by `itemIdentifier`. Earlier iOS ignores it.
 */
export const NavigationItemMorph = (props: NavigationItemMorphProps) => (
  <NativeNavigationItemMorph {...props} disableForceFlatten style={CONTENTS_STYLE} />
)
