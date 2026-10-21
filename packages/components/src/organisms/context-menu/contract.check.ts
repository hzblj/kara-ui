import {ContextMenu as Android} from './context-menu.android'
import {ContextMenu as Ios} from './context-menu.ios'
import type {ContextMenuComponent} from './context-menu.types'

export const _ios: ContextMenuComponent = Ios
export const _android: ContextMenuComponent = Android
