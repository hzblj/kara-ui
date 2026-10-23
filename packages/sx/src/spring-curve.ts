import {type SpringName, springPhysics} from '@hzblj/kara-theme'
import {linear} from 'react-native-reanimated'

/** How close to the target counts as arrived: a thousandth of the distance, well under a pixel on a phone. */
const REST = 0.001

const STEP = 1 / 240

/** A spring that never settles is a mistake, not a curve: stop drawing it after this long. */
const MAX_SECONDS = 4

/** Points of the curve handed to `linear()`: enough for a bounce to stay round. */
const POINTS = 48

/** The spring's step response, 0 to 1, at `t` seconds: an underdamped oscillation, or the critical case. */
const position = (t: number, omega: number, zeta: number): number => {
  if (zeta >= 1) {
    return 1 - Math.exp(-omega * t) * (1 + omega * t)
  }

  const damped = omega * Math.sqrt(1 - zeta * zeta)

  return 1 - Math.exp(-zeta * omega * t) * (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t))
}

/** When it comes to rest: the last moment it was further than `REST` from the target. */
const settleTime = (omega: number, zeta: number): number => {
  let last = 0

  for (let t = 0; t <= MAX_SECONDS; t += STEP) {
    if (Math.abs(1 - position(t, omega, zeta)) > REST) {
      last = t
    }
  }

  return last + STEP
}

export type SpringCurve = {
  /** Milliseconds until it rests: the transition's duration. */
  duration: number
  timingFunction: ReturnType<typeof linear>
}

const curves = new Map<SpringName, SpringCurve>()

/**
 * A spring token drawn as a CSS `linear()` easing over the time it takes to rest, which is how a CSS transition runs a
 * spring: the same physics as `spring()`, sampled. What it cannot keep is the speed of an interrupted transition, which
 * a CSS transition restarts from rest.
 */
export const springCurve = (name: SpringName): SpringCurve => {
  const existing = curves.get(name)

  if (existing) {
    return existing
  }

  const {dampingRatio, stiffness} = springPhysics(name)
  const omega = Math.sqrt(stiffness)
  const seconds = settleTime(omega, dampingRatio)
  const points = Array.from({length: POINTS + 1}, (_, index) =>
    index === POINTS ? 1 : Number(position((seconds * index) / POINTS, omega, dampingRatio).toFixed(4))
  )
  const result = {duration: Math.round(seconds * 1000), timingFunction: linear(...points)}

  curves.set(name, result)

  return result
}
