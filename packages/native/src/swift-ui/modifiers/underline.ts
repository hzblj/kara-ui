import {createModifier} from '@expo/ui/swift-ui/modifiers'
import type {ColorValue} from 'react-native'

export type UnderlineParams = {
  color: ColorValue
  /** In points. Defaults to 1. */
  thickness?: number
}

/**
 * A line along the bottom edge of the view — on a text with a fixed line height, the bottom of the line box. SwiftUI's
 * own `underline` sits right under the baseline instead.
 */
export const underline = (params: UnderlineParams) => createModifier('underline', params)
