/**
 * The springs motion settles on, as SwiftUI names them: a perceptual `duration` (SwiftUI's response, the period of the
 * spring left undamped) in milliseconds, and how much it `bounce`s past its target, 0 for none. One spring is the same
 * curve everywhere kara drives one: Reanimated's `withSpring` and layout transitions, an `animate` transition, SwiftUI's
 * `.spring(response:dampingFraction:)` and Compose's `spring(dampingRatio, stiffness)`. A spring keeps the speed it has
 * when it is interrupted, which is why what a finger drives is one: a press let go halfway eases back, never jerks.
 */
export const springs = {
  /** 600 ms, a clear bounce: an emphasised moment. A heart filling, a badge appearing. */
  bouncy: {bounce: 0.3, duration: 600},
  /** 180 ms, no bounce: what follows a finger. A press, a drag, a thumb under it. */
  interactive: {bounce: 0, duration: 180},
  /** 420 ms, no bounce: what settles by itself. Content moving into place, a press let go. */
  smooth: {bounce: 0, duration: 420},
  /** 360 ms, a touch of bounce: a quick, decided change. A toggle, a selection jumping to its place. */
  snappy: {bounce: 0.15, duration: 360},
} as const satisfies Record<string, {bounce: number; duration: number}>

export type SpringName = keyof typeof springs

/**
 * A spring token as the physics every platform takes: mass 1, `stiffness` from the response, `damping` from the bounce
 * (`dampingRatio` is 1 minus it). Shared so the Reanimated, CSS, SwiftUI and Compose paths cannot drift apart.
 */
export const springPhysics = (name: SpringName) => {
  const {bounce, duration} = springs[name]
  const response = duration / 1000
  const omega = (2 * Math.PI) / response
  const dampingRatio = 1 - bounce

  return {damping: 2 * dampingRatio * omega, dampingRatio, mass: 1, response, stiffness: omega * omega}
}
