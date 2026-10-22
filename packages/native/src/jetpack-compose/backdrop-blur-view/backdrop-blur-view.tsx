import {requireKaraView} from '../../require-view'
import type {BackdropBlurViewProps} from './backdrop-blur-view.types'

/**
 * What lies behind the view, blurred (Android 12+), under a tint and an optional hairline, in a rounded shape that
 * clips the React Native children too. A plain view, not Compose — it needs no host.
 */
export const BackdropBlurView = requireKaraView<BackdropBlurViewProps>('BackdropBlurView')
