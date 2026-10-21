import {ZStack as Android} from './z-stack.android'
import {ZStack as Ios} from './z-stack.ios'
import type {ZStackComponent} from './z-stack.types'

export const _ios: ZStackComponent = Ios
export const _android: ZStackComponent = Android
