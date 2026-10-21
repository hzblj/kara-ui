import {DatePicker as Android} from './date-picker.android'
import {DatePicker as Ios} from './date-picker.ios'
import type {DatePickerComponent} from './date-picker.types'

export const _ios: DatePickerComponent = Ios
export const _android: DatePickerComponent = Android
