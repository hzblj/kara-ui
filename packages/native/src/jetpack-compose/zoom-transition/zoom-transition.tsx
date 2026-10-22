import {requireOptionalNativeModule} from 'expo'
import type {ViewStyle} from 'react-native'

import {KARA_UI_MODULE, requireKaraView} from '../../require-view'
import type {
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './zoom-transition.types'

type KaraUIModule = {reverseZoomTransition?: (identifier: string) => Promise<void>}

type NativeViewProps = {collapsable: boolean; style?: ViewStyle}

/** Draws nothing and takes no room; it only carries the screen's transform options. */
const ENABLER: ViewStyle = {height: 0, position: 'absolute', width: 0}

const NativeZoomTransitionSource = requireKaraView<NativeViewProps & ZoomTransitionSourceProps>(
  'ZoomTransitionSourceView'
)

const NativeZoomTransitionTarget = requireKaraView<Omit<NativeViewProps, 'style'> & ZoomTransitionTargetProps>(
  'ZoomTransitionTargetView'
)

const NativeZoomTransitionEnabler = requireKaraView<NativeViewProps & ZoomTransitionEnablerProps>(
  'ZoomTransitionEnablerView'
)

/** The view Material's container transform grows from, and shrinks back into. */
export const ZoomTransitionSource = ({children, cornerRadius = 0, identifier}: ZoomTransitionSourceProps) => (
  <NativeZoomTransitionSource collapsable={false} cornerRadius={cornerRadius} identifier={identifier}>
    {children}
  </NativeZoomTransitionSource>
)

/** The view the transform lands on in the pushed screen. Hidden until the transform reaches it. */
export const ZoomTransitionTarget = ({
  children,
  cornerRadius = 0,
  identifier,
  isFittedToSourceAspectRatio = false,
  style,
}: ZoomTransitionTargetProps) => (
  <NativeZoomTransitionTarget
    collapsable={false}
    cornerRadius={cornerRadius}
    identifier={identifier}
    isFittedToSourceAspectRatio={isFittedToSourceAspectRatio}
    style={style}
  >
    {children}
  </NativeZoomTransitionTarget>
)

/** Carries the transform options of the screen it is mounted in to that screen's target. */
export const ZoomTransitionEnabler = (props: ZoomTransitionEnablerProps) => (
  <NativeZoomTransitionEnabler {...props} collapsable={false} style={ENABLER} />
)

/**
 * Plays the transform back from the target into its source. Call it when the screen starts to leave
 * (`beforeRemove`): the pop is native and starts before JavaScript hears of it, so the target is snapshotted while it
 * is still on screen. A no-op in a build without the module.
 */
export const reverseZoomTransition = async (identifier: string): Promise<void> => {
  await requireOptionalNativeModule<KaraUIModule>(KARA_UI_MODULE)?.reverseZoomTransition?.(identifier)
}
