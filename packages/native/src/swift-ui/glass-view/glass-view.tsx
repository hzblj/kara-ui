import type {ReactNode} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

export type GlassViewProps = {
  children?: ReactNode
  /** Pins the glass to the app's appearance rather than the trait it inherits. */
  colorScheme?: 'dark' | 'light'
  /** Tints the material. Unset leaves it clear. */
  glassTint?: ColorValue
  /** Swells toward the finger on touch. Give the children `pointerEvents="none"`. */
  isInteractive?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** iOS 26 Liquid Glass as a UIKit view, shaped as a capsule. A React Native view, so it needs no host. */
export const GlassView = requireKaraView<GlassViewProps>('GlassView')
