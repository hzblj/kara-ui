import {type DurationSize, duration, type EasingName, easing} from '@hzblj/kara-theme'
import {Easing, ReduceMotion, type WithTimingConfig} from 'react-native-reanimated'

/**
 * A Reanimated timing from the motion tokens, `smoothOut` unless told otherwise. `ReduceMotion.Never`, because a
 * component has applied `useReducedMotion` before it animates: what is left (a fade, a dim) is meant to run, and
 * Reanimated's own check reads the setting once at launch and never hears of `KaraProvider reduceMotion`.
 */
export const timing = (size: DurationSize, curve: EasingName = 'smoothOut'): WithTimingConfig => {
  const [x1, y1, x2, y2] = easing[curve]

  return {duration: duration[size], easing: Easing.bezier(x1, y1, x2, y2), reduceMotion: ReduceMotion.Never}
}
