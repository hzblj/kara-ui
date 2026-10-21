import {ScrollView as Android} from './scroll-view.android'
import {ScrollView as Ios} from './scroll-view.ios'
import type {ScrollViewComponent} from './scroll-view.types'

export const _ios: ScrollViewComponent = Ios
export const _android: ScrollViewComponent = Android
