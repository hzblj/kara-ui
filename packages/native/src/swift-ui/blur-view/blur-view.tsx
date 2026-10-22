import {requireKaraView} from '../../require-view'
import type {BlurViewProps} from './blur-view.types'

/** The system's materials as a UIKit view — `UIBlurEffect` with optional vibrancy. A React Native view: no host. */
export const BlurView = requireKaraView<BlurViewProps>('BlurView')
