import {NavigationBar as Android} from './navigation-bar.android'
import {NavigationBar as Ios} from './navigation-bar.ios'
import type {NavigationBarComponent} from './navigation-bar.types'

export const _ios: NavigationBarComponent = Ios
export const _android: NavigationBarComponent = Android
