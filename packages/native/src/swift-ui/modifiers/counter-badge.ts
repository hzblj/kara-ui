import {createModifier} from '@expo/ui/swift-ui/modifiers'
import type {ColorValue} from 'react-native'

export type CounterBadgeParams = {
  backgroundColor?: ColorValue
  count: number
  fontFamily?: string
  foregroundColor?: ColorValue
}

/**
 * A count badge drawn as a native overlay on the top trailing corner — part of the modified view, so it moves with
 * the view's own press animation (an interactive glass swell included). Hidden at zero.
 */
export const counterBadge = (params: CounterBadgeParams) => createModifier('counterBadge', params)
