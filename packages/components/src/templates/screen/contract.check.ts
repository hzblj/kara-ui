import {Screen as Android} from './screen.android'
import {Screen as Ios} from './screen.ios'
import type {ScreenComponent} from './screen.types'

export const _ios: ScreenComponent = Ios
export const _android: ScreenComponent = Android
