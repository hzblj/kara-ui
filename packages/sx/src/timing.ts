import {type DurationSize, duration, type EasingName, easing, type SpringName, springPhysics} from '@hzblj/kara-theme'
import {
  Easing,
  type EasingFunctionFactory,
  ReduceMotion,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated'

/** One Reanimated bézier per curve, built once: every preset and timing shares them. */
const CURVES = Object.fromEntries(
  (Object.keys(easing) as EasingName[]).map(name => {
    const [x1, y1, x2, y2] = easing[name]

    return [name, Easing.bezier(x1, y1, x2, y2)]
  })
) as Record<EasingName, EasingFunctionFactory>

/** A motion token's curve as Reanimated takes it: `withTiming`'s `easing`, or a builder's `.easing()`. */
export const curve = (name: EasingName): EasingFunctionFactory => CURVES[name]

/**
 * A Reanimated timing from the motion tokens, `smoothOut` unless told otherwise. `ReduceMotion.Never`, because a
 * component has applied `useReducedMotion` before it animates: what is left (a fade, a dim) is meant to run, and
 * Reanimated's own check reads the setting once at launch and never hears of `KaraProvider reduceMotion`.
 */
export const timing = (size: DurationSize, name: EasingName = 'smoothOut'): WithTimingConfig => ({
  duration: duration[size],
  easing: CURVES[name],
  reduceMotion: ReduceMotion.Never,
})

/**
 * A spring token as `withSpring`'s config: `withSpring(1, spring('snappy'))`. Mass, stiffness and damping rather than
 * Reanimated's perceptual duration, so it is exactly the curve SwiftUI, Compose and an `animate` transition draw for the
 * same token. `ReduceMotion.Never`, for the reason `timing` gives.
 */
export const spring = (name: SpringName): WithSpringConfig => {
  const {damping, mass, stiffness} = springPhysics(name)

  return {damping, mass, reduceMotion: ReduceMotion.Never, stiffness}
}
