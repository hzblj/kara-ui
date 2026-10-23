import {requireKaraView} from '../../require-view'
import type {ScrollViewZPositionProps} from './scroll-view-z-position.types'

/**
 * Raises the React Native scroll view it is placed in above its later siblings without moving it among them, which
 * Fabric's `zIndex` would: a large title anchored in an empty scroll view under the content (UIKit reads it from
 * `subviews[0]`) stays visible on iOS 27, whose scroll edge effect blurs only what lies under it. Zero-size, iOS only.
 */
export const ScrollViewZPosition = requireKaraView<ScrollViewZPositionProps>('ScrollViewZPositionView')
