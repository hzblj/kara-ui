import {createModifier, type ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'
import type {ColorValue} from 'react-native'

export type UnderlineParams = {
  color: ColorValue
  /** In dp. Defaults to 1. */
  thickness?: number
}

/**
 * A line along the bottom edge of the composable — on a text with a fixed line height, the bottom of the line box.
 * `TextDecoration.Underline` sits right under the baseline instead.
 */
export const underline = (params: UnderlineParams): ModifierConfig => createModifier('underline', params)
