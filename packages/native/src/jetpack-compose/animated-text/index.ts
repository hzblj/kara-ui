import type {ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'
import type {ColorValue} from 'react-native'

import {requireKaraView} from '../../require-view'

/** A run of the text in a colour of its own; without one it takes `textColor`. */
export type AnimatedTextSpan = {
  color?: ColorValue
  text: string
}

/**
 * How a colour moves to its next value: a spring (kara's spring tokens, and `smoothOut` as a no-bounce spring over its
 * duration) or a tween along a cubic bézier.
 */
export type TextAnimation =
  | {type: 'spring'; dampingRatio: number; stiffness: number}
  | {type: 'tween'; delayMillis?: number; durationMillis: number; easing?: readonly [number, number, number, number]}

/** Compose's `TextOverflow`, by name. Not `overflow`: Fabric would read that as the view's style. */
export type AnimatedTextOverflow = 'clip' | 'ellipsis' | 'middleEllipsis' | 'startEllipsis'

export type AnimatedTextProps = {
  /** How a colour moves to its next value. Without one it switches. */
  animation?: TextAnimation
  fontFamily?: string
  /** OpenType features, CSS-style: `tnum` for digits of one width. */
  fontFeatureSettings?: string
  fontSize?: number
  fontWeight?: string
  lineHeight?: number
  maxLines?: number
  modifiers?: ModifierConfig[]
  spans: AnimatedTextSpan[]
  textAlign?: 'center' | 'left' | 'right'
  textColor?: ColorValue
  textDecoration?: 'lineThrough' | 'none' | 'underline'
  /**
   * How a text cut short by `maxLines` ends: Compose's `TextOverflow`. `ellipsis` by default, at the end of the last
   * line. `startEllipsis` and `middleEllipsis` hold for a single line only (`maxLines` 1); on more lines Compose clips.
   */
  textOverflow?: AnimatedTextOverflow
}

/**
 * Compose `Text` over runs of colour that ease to their next colour instead of switching: what `Text` draws with
 * `animate` and spans on Android, and with `monospacedDigit`, which `@expo/ui`'s text has no font features for. Inside
 * a Compose host.
 */
export const AnimatedText = requireKaraView<AnimatedTextProps>('AnimatedTextView')
