import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './zoom-transition.types'

/**
 * `collapsableChildren` keeps Fabric from flattening the child away; `disableForceFlatten` (read by
 * `ExpoViewShadowNode`) keeps the wrapper itself although `display: contents` gives it no layout box.
 */
type NativeWrapperProps = {
  collapsable?: boolean
  collapsableChildren?: boolean
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS: ViewStyle = {display: 'contents'}

const NativeZoomTransitionSource = requireKaraView<NativeWrapperProps & ZoomTransitionSourceProps>(
  'ZoomTransitionSourceView'
)

const NativeZoomTransitionTarget = requireKaraView<NativeWrapperProps & ZoomTransitionTargetProps>(
  'ZoomTransitionTargetView'
)

const NativeZoomTransitionEnabler = requireKaraView<NativeWrapperProps & ZoomTransitionEnablerProps>(
  'ZoomTransitionEnablerView'
)

/** Registers its single child as the view an iOS 18 zoom push grows from. Adds no layout box. */
export const ZoomTransitionSource = ({children, identifier}: ZoomTransitionSourceProps) => (
  <NativeZoomTransitionSource
    collapsable={false}
    collapsableChildren={false}
    disableForceFlatten
    identifier={identifier}
    style={CONTENTS}
  >
    {children}
  </NativeZoomTransitionSource>
)

/** Registers its single child as the frame the source lands on in the pushed screen. Adds no layout box. */
export const ZoomTransitionTarget = ({children, identifier, isAspectRatioMatched}: ZoomTransitionTargetProps) => (
  <NativeZoomTransitionTarget
    collapsable={false}
    collapsableChildren={false}
    disableForceFlatten
    identifier={identifier}
    isAspectRatioMatched={isAspectRatioMatched}
    style={CONTENTS}
  >
    {children}
  </NativeZoomTransitionTarget>
)

/**
 * Turns the push of the screen it is mounted in into an iOS 18 zoom from `sourceIdentifier`. Must render in the
 * screen's first commit — react-native-screens pushes right after it. Below iOS 18 the push stays the regular slide.
 */
export const ZoomTransitionEnabler = (props: ZoomTransitionEnablerProps) => (
  <NativeZoomTransitionEnabler {...props} disableForceFlatten style={CONTENTS} />
)
