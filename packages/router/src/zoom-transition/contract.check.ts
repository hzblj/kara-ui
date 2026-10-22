import {ZoomTransition as Android} from './zoom-transition.android'
import {ZoomTransition as Ios} from './zoom-transition.ios'
import type {ZoomTransitionComponent} from './zoom-transition.types'

export const _ios: ZoomTransitionComponent = Ios
export const _android: ZoomTransitionComponent = Android
