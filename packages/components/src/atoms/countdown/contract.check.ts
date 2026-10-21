import {Countdown as Android} from './countdown.android'
import {Countdown as Ios} from './countdown.ios'
import type {CountdownComponent} from './countdown.types'

export const _ios: CountdownComponent = Ios
export const _android: CountdownComponent = Android
