import {Sheet as Android} from './sheet.android'
import {Sheet as Ios} from './sheet.ios'
import type {SheetComponent} from './sheet.types'

export const _ios: SheetComponent = Ios
export const _android: SheetComponent = Android
