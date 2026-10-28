import {SheetGrabber as NativeSheetGrabber} from '@hzblj/kara-native/swift-ui'

import type {SheetGrabberComponent, SheetGrabberProps} from './sheet-grabber.types'

/**
 * The system grabber of a native-stack screen presented as a sheet (`presentation: 'modal'`), which react-native-screens
 * gives only `formSheet`. Render it anywhere in the presented content, a nested stack's screens included; it takes no
 * room. Android draws no grabber on a full-screen modal, and this renders nothing there.
 */
export const SheetGrabber: SheetGrabberComponent = ({visible = true}: SheetGrabberProps) => (
  <NativeSheetGrabber grabberVisible={visible} />
)
