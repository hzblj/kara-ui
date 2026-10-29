import {createModifier} from '@expo/ui/swift-ui/modifiers'
import type {NativeIconEffectRecord} from '@hzblj/expo-native-icons'
import type {ColorValue} from 'react-native'

export type SymbolStyleParams = {
  color?: ColorValue
  /** The effect, flattened by `nativeIconEffectRecord`. */
  effect?: NativeIconEffectRecord
  /** Runs `effect` while true when there is no trigger. */
  effectActive?: boolean
  /** Plays `effect` once per change, from `nativeIconTriggerKey`. */
  effectTrigger?: string
  /** iOS 26's gradient shading. */
  gradient?: boolean
  renderingMode?: 'hierarchical' | 'monochrome' | 'multicolor' | 'palette'
  secondaryColor?: ColorValue
  tertiaryColor?: ColorValue
  /** The replace transition, played when `transitionValue` changes. */
  transition?: string
  /** What a transition animates a change of: the symbol's name and variable value. */
  transitionValue?: string
}

/**
 * Everything SF Symbols does with an app icon's custom symbol, on `@expo/ui`'s `Image(assetName:)`: its rendering
 * mode and colours, iOS 26's gradient, the replace transition and an effect, once per trigger or while active. The
 * SwiftUI half of `@hzblj/expo-native-icons`' `NativeIconView`, so `Icon` and `RnIcon` agree.
 */
export const symbolStyle = (params: SymbolStyleParams) => createModifier('symbolStyle', params)
