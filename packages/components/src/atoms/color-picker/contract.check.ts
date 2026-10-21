import {ColorPicker as Android} from './color-picker.android'
import {ColorPicker as Ios} from './color-picker.ios'
import type {ColorPickerComponent} from './color-picker.types'

export const _ios: ColorPickerComponent = Ios
export const _android: ColorPickerComponent = Android
