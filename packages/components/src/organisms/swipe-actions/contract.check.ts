import {SwipeActions as Android} from './swipe-actions.android'
import {SwipeActions as Ios} from './swipe-actions.ios'
import type {SwipeActionsComponent} from './swipe-actions.types'

export const _ios: SwipeActionsComponent = Ios
export const _android: SwipeActionsComponent = Android
