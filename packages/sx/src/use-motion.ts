import {useAppTheme, useReducedMotion} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'

import {animateStyle, type TransitionStyle} from './animate-style'
import type {MotionProps, ReanimatedEntryExit, ReanimatedLayout, SxEntryExit} from './motion.types'
import {type MotionPhase, resolveEntryExit, resolveLayout} from './motion-presets'

/** Mirrored like the `sx` key records: a motion prop missing here would leak into the wrapped component's props. */
const MOTION_KEY_RECORD = {
  animate: true,
  animated: true,
  entering: true,
  exiting: true,
  layout: true,
} as const satisfies Record<keyof MotionProps, true>

export const MOTION_KEYS = Object.keys(MOTION_KEY_RECORD) as readonly (keyof MotionProps)[]

/** What a view hands its Reanimated twin: the resolved builders, and the style overlay `animate` needs. */
export type SxMotion = {
  /**
   * Whether the props ask for Reanimated at all. Passing one of them, even `false`, does: a view picks its component
   * when it mounts, so `animate={enabled}` has to be a Reanimated view before `enabled` first turns true.
   */
  animated: boolean
  entering?: ReanimatedEntryExit
  exiting?: ReanimatedEntryExit
  layout?: ReanimatedLayout
  /** The transition, with the colours it carries in a form Reanimated can interpolate. Goes after the resolved style. */
  style?: TransitionStyle
}

const asksForMotion = ({animate, animated, entering, exiting, layout}: MotionProps): boolean =>
  animated === true || animate !== undefined || entering !== undefined || exiting !== undefined || layout !== undefined

const entryExit = (motion: MotionProps, phase: MotionPhase, reduced: boolean) =>
  resolveEntryExit(motion[phase], phase, reduced)

/**
 * The motion props, resolved against the motion tokens and the user's Reduce Motion: presets become kara's worklets
 * (shared by every view that asks for the same one), `layout` becomes kara's transition, `animate` the CSS transition
 * overlay for `style`. A view with none of them gets `animated: false` and nothing else, and renders as it always did.
 */
export const useMotion = (motion: MotionProps, style: ViewStyle): SxMotion => {
  const reduced = useReducedMotion()
  const theme = useAppTheme()

  if (!asksForMotion(motion)) {
    return {animated: false}
  }

  return {
    animated: true,
    entering: entryExit(motion, 'entering', reduced),
    exiting: entryExit(motion, 'exiting', reduced),
    layout: resolveLayout(motion.layout, reduced),
    style: animateStyle(motion.animate, style, theme, reduced),
  }
}

/**
 * kara's `entering` for a Reanimated view of your own, reduced with the user's setting:
 * `<Animated.View entering={useEntering('fadeUp')} />`. A `Box` takes the preset directly and needs none of this.
 */
export const useEntering = (value: SxEntryExit): ReanimatedEntryExit | undefined =>
  resolveEntryExit(value, 'entering', useReducedMotion())

/** `useEntering` for leaving: `quick` unless told otherwise. */
export const useExiting = (value: SxEntryExit): ReanimatedEntryExit | undefined =>
  resolveEntryExit(value, 'exiting', useReducedMotion())

/** kara's layout transition (`fast`, `smoothOut`), or nothing with motion reduced, for a Reanimated view of your own. */
export const useLayoutTransition = (): ReanimatedLayout | undefined => resolveLayout(true, useReducedMotion())
