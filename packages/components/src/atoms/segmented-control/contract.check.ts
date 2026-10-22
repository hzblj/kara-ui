import {SegmentedControl as Android} from './segmented-control.android'
import {SegmentedControl as Ios} from './segmented-control.ios'
import type {SegmentedControlComponent} from './segmented-control.types'

export const _ios: SegmentedControlComponent = Ios
export const _android: SegmentedControlComponent = Android
