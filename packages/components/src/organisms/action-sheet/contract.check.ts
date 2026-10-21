import {ActionSheet as Android} from './action-sheet.android'
import {ActionSheet as Ios} from './action-sheet.ios'
import type {ActionSheetComponent} from './action-sheet.types'

export const _ios: ActionSheetComponent = Ios
export const _android: ActionSheetComponent = Android
