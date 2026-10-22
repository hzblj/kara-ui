import {ActivityIndicator as Android} from './activity-indicator.android'
import {ActivityIndicator as Ios} from './activity-indicator.ios'
import type {ActivityIndicatorComponent} from './activity-indicator.types'

export const _ios: ActivityIndicatorComponent = Ios
export const _android: ActivityIndicatorComponent = Android
