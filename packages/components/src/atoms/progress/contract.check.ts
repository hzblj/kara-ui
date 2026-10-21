import {Progress as Android} from './progress.android'
import {Progress as Ios} from './progress.ios'
import type {ProgressComponent} from './progress.types'

export const _ios: ProgressComponent = Ios
export const _android: ProgressComponent = Android
