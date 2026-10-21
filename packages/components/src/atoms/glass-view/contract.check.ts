import {GlassView as Android} from './glass-view.android'
import {GlassView as Ios} from './glass-view.ios'
import type {GlassViewComponent} from './glass-view.types'

export const _ios: GlassViewComponent = Ios
export const _android: GlassViewComponent = Android
