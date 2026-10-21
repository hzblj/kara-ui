import {RnContextMenu as Android} from './rn-context-menu.android'
import {RnContextMenu as Ios} from './rn-context-menu.ios'
import type {RnContextMenuComponent} from './rn-context-menu.types'

export const _ios: RnContextMenuComponent = Ios
export const _android: RnContextMenuComponent = Android
