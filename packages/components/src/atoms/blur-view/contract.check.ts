import {BlurView as Android} from './blur-view.android'
import {BlurView as Ios} from './blur-view.ios'
import type {BlurViewComponent} from './blur-view.types'

export const _ios: BlurViewComponent = Ios
export const _android: BlurViewComponent = Android
