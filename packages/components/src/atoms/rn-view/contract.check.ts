import {RnView as Android} from './rn-view.android'
import {RnView as Ios} from './rn-view.ios'
import type {RnViewComponent} from './rn-view.types'

export const _ios: RnViewComponent = Ios
export const _android: RnViewComponent = Android
