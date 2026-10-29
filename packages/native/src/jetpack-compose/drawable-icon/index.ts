import type {NativeIconEffectRecord} from '@hzblj/expo-native-icons'
import type {ColorValue} from 'react-native'

import {requireKaraView} from '../../require-view'

export type DrawableIconProps = {
  accessibilityLabel?: string
  /** The effect, flattened by `nativeIconEffectRecord`. */
  effect?: NativeIconEffectRecord
  /** Runs `effect` while true when there is no trigger. */
  effectActive?: boolean
  /** Plays `effect` once per change, from `nativeIconTriggerKey`. */
  effectTrigger?: string
  gradient?: boolean
  /** Unset takes the surrounding `LocalContentColor` — the content colour of the button or bar it sits in. */
  iconColor?: ColorValue
  /** In dp. Unset keeps the drawable's own 24 dp. */
  iconSize?: number
  renderingMode?: string
  /** A vector drawable resource — `native_icon_*` (the app's icons, `@hzblj/expo-native-icons`) or `kara_glyph_*` (kara's own). */
  resourceName: string
  secondaryColor?: ColorValue
  tertiaryColor?: ColorValue
  transition?: string
  variableValue?: number
}

/**
 * Material's `Icon` over a vector drawable, inside a Compose host. With an effect, a transition, a rendering mode other
 * than monochrome, a variable value or a gradient, `@hzblj/expo-native-icons`' `NativeIconView` draws it instead, which
 * plays them.
 */
export const DrawableIcon = requireKaraView<DrawableIconProps>('DrawableIconView')
