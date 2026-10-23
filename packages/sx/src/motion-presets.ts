import {duration as durations, type SpringName, spacing, springPhysics, springs} from '@hzblj/kara-theme'
import {
  type EntryExitAnimationFunction,
  LinearTransition,
  ReduceMotion,
  type WithSpringConfig,
  type WithTimingConfig,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import type {
  MotionPresetConfig,
  ReanimatedEntryExit,
  ReanimatedLayout,
  SxEntryExit,
  SxLayout,
  SxLayoutConfig,
} from './motion.types'
import {curve, spring, timing} from './timing'

export type MotionPhase = 'entering' | 'exiting'

/** Where a preset starts when it arrives, and where it ends when it leaves: the box at rest is opaque, unmoved, 1:1. */
type Pose = {opacity: number; scale: number; translateY: number}

const REST: Pose = {opacity: 1, scale: 1, translateY: 0}

/** Small enough to read as the box itself growing, not as something flying in from behind it. */
const SCALE_FROM = 0.92

/**
 * Named by the way the box moves, both ways: `fadeUp` rises into place and floats away upward, `fadeDown` settles from
 * above and sinks away.
 */
const poseOf = ({preset}: MotionPresetConfig, distance: number, phase: MotionPhase): Pose => {
  const arriving = phase === 'entering'

  switch (preset) {
    case 'fadeUp':
      return {opacity: 0, scale: 1, translateY: arriving ? distance : -distance}
    case 'fadeDown':
      return {opacity: 0, scale: 1, translateY: arriving ? -distance : distance}
    case 'scale':
      return {opacity: 0, scale: SCALE_FROM, translateY: 0}
    default:
      return {opacity: 0, scale: 1, translateY: 0}
  }
}

/** A preset's motion: a duration on a curve, or a spring. */
type Drive = {config: WithTimingConfig; springs: false} | {config: WithSpringConfig; springs: true}

/**
 * One worklet for every preset: it fades from `from` to `to` and moves only the transforms that differ, so a `fade`
 * never touches the transform at all. `ReduceMotion.Never`, because the reduced variant has already been picked.
 */
const presetAnimation = (from: Pose, to: Pose, drive: Drive, delay: number): EntryExitAnimationFunction => {
  const moves = from.translateY !== to.translateY
  const scales = from.scale !== to.scale
  const {config, springs} = drive

  return () => {
    'worklet'

    const animate = (value: number) =>
      withDelay(
        delay,
        springs ? withSpring(value, config as WithSpringConfig) : withTiming(value, config as WithTimingConfig),
        ReduceMotion.Never
      )
    const initialTransform = []
    const transform = []

    if (moves) {
      initialTransform.push({translateY: from.translateY})
      transform.push({translateY: animate(to.translateY)})
    }

    if (scales) {
      initialTransform.push({scale: from.scale})
      transform.push({scale: animate(to.scale)})
    }

    return transform.length > 0
      ? {
          animations: {opacity: animate(to.opacity), transform},
          initialValues: {opacity: from.opacity, transform: initialTransform},
        }
      : {animations: {opacity: animate(to.opacity)}, initialValues: {opacity: from.opacity}}
  }
}

/** Delays differ per item of a stagger, so the space is not tiny, but it is bounded by what an app animates. */
const MAX_PRESETS = 256

const presets = new Map<string, EntryExitAnimationFunction>()

const presetFor = (config: MotionPresetConfig, phase: MotionPhase, reduced: boolean): EntryExitAnimationFunction => {
  // With motion reduced every preset fades: nothing rises, sinks or grows, and it still reads as arriving.
  const preset = reduced ? 'fade' : config.preset
  const size = config.duration ?? (phase === 'entering' ? 'fast' : 'quick')
  const easing = config.easing ?? 'smoothOut'
  const distance = spacing[config.distance ?? 's12']
  const delay = config.delay ?? 0
  const key = `${phase}|${preset}|${config.spring ?? `${size}|${easing}`}|${distance}|${delay}`
  const existing = presets.get(key)

  if (existing) {
    return existing
  }

  if (presets.size >= MAX_PRESETS) {
    presets.clear()
  }

  const pose = poseOf({...config, preset}, distance, phase)
  const drive: Drive = config.spring
    ? {config: spring(config.spring), springs: true}
    : {config: timing(size, easing), springs: false}
  const animation =
    phase === 'entering' ? presetAnimation(pose, REST, drive, delay) : presetAnimation(REST, pose, drive, delay)

  presets.set(key, animation)

  return animation
}

/**
 * A plain object literal, as opposed to a Reanimated builder: an instance carries `duration` and `easing` too, as
 * methods on its prototype, so the keys alone cannot tell the two apart.
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype

const isPresetConfig = (value: SxEntryExit): value is MotionPresetConfig => isPlainObject(value) && 'preset' in value

/**
 * A preset by name or config becomes kara's worklet, shared by every view that asks for the same one. Reanimated's
 * own builders pass through untouched: they are the caller's, and Reanimated follows the device's setting for them.
 */
export const resolveEntryExit = (
  value: SxEntryExit | undefined,
  phase: MotionPhase,
  reduced: boolean
): ReanimatedEntryExit | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    return presetFor({preset: value}, phase, reduced)
  }

  return isPresetConfig(value) ? presetFor(value, phase, reduced) : value
}

const layouts = new Map<string, ReanimatedLayout>()

/** `LinearTransition` on a spring (mass, stiffness and damping, as `spring()`) or on a duration and a curve. */
const layoutFor = (config: SxLayoutConfig): ReanimatedLayout => {
  const key = config.spring ?? `${config.duration ?? 'fast'}|${config.easing ?? 'smoothOut'}`
  let existing = layouts.get(key)

  if (!existing) {
    if (config.spring) {
      const {damping, mass, stiffness} = springPhysics(config.spring)
      existing = LinearTransition.springify().mass(mass).stiffness(stiffness).damping(damping)
    } else {
      existing = LinearTransition.duration(durations[config.duration ?? 'fast']).easing(
        curve(config.easing ?? 'smoothOut')
      )
    }

    existing = existing.reduceMotion(ReduceMotion.Never)
    layouts.set(key, existing)
  }

  return existing
}

/**
 * `true` is kara's: into place on the `smooth` spring, which keeps its speed when another change interrupts it. A spring
 * token or a timed config adjusts it; every one of them snaps with motion reduced. Reanimated's own pass through.
 */
export const resolveLayout = (value: SxLayout | undefined, reduced: boolean): ReanimatedLayout | undefined => {
  if (value === undefined || value === false) {
    return undefined
  }

  if (value === true || typeof value === 'string' || isPlainObject(value)) {
    if (reduced) {
      return undefined
    }

    if (value === true) {
      return layoutFor({spring: 'smooth'})
    }

    return typeof value === 'string' && value in springs
      ? layoutFor({spring: value as SpringName})
      : layoutFor(value as SxLayoutConfig)
  }

  return value as ReanimatedLayout
}
