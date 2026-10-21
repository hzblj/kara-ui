import {Alert as Android} from './alert.android'
import {Alert as Ios} from './alert.ios'
import type {AlertComponent} from './alert.types'

export const _ios: AlertComponent = Ios
export const _android: AlertComponent = Android
