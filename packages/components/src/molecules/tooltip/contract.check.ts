import {Tooltip as Android} from './tooltip.android'
import {Tooltip as Ios} from './tooltip.ios'
import type {TooltipComponent} from './tooltip.types'

export const _ios: TooltipComponent = Ios
export const _android: TooltipComponent = Android
