import {Picker as Android} from './picker.android'
import {Picker as Ios} from './picker.ios'
import type {PickerComponent} from './picker.types'

export const _ios: PickerComponent = Ios
export const _android: PickerComponent = Android
