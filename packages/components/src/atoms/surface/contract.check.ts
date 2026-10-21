import {Surface as Android} from './surface.android'
import {Surface as Ios} from './surface.ios'
import type {SurfaceComponent} from './surface.types'

export const _ios: SurfaceComponent = Ios
export const _android: SurfaceComponent = Android
