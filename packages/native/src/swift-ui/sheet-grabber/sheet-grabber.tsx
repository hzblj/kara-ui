import type {ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {SheetGrabberProps} from './sheet-grabber.types'

type NativeSheetGrabberProps = SheetGrabberProps & {
  disableForceFlatten: boolean
  style: ViewStyle
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeSheetGrabber = requireKaraView<NativeSheetGrabberProps>('SheetGrabberView')

/**
 * The system grabber of a screen presented as a sheet (a native-stack `modal`, which react-native-screens gives none),
 * from any screen of a stack nested in it. Mount it in the presented content; it takes no room. iOS only.
 */
export const SheetGrabber = (props: SheetGrabberProps) => (
  <NativeSheetGrabber {...props} disableForceFlatten style={CONTENTS_STYLE} />
)
