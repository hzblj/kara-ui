import {ScrollEdgeContainer as Android} from './scroll-edge-container.android'
import {ScrollEdgeContainer as Ios} from './scroll-edge-container.ios'
import type {ScrollEdgeContainerComponent} from './scroll-edge-container.types'

export const _ios: ScrollEdgeContainerComponent = Ios
export const _android: ScrollEdgeContainerComponent = Android
