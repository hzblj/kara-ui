import type {FC} from 'react'

import type shots from './shots.json'

/**
 * Where a scene is in its timeline. A still is always taken at step 0 and phase 0, so that is the state worth
 * photographing; a recording plays the steps (or the phase) in a loop, which is why every timeline returns to where it
 * started.
 */
export type SceneProps = {
  /** 0…1 across the shot's `period`, repeating — for motion with no steps, like a slider being dragged. */
  phase: number
  /** Index into the shot's `steps`. */
  step: number
}

export type Scene = FC<SceneProps>

export type ShotId = keyof typeof shots

/** Shots that open a real route (`url`) rather than a scene of their own. */
export type RouteShotId = 'tabs' | 'zoom-transition'

export type SceneId = Exclude<ShotId, RouteShotId>

export type ShotFrame = 'bottom' | 'center' | 'screen'

/** How a shot is captured — read by `scripts/capture-shots.sh` as well as by the harness. */
export type ShotConfig = {
  /**
   * Which part of the screen is kept: a 4:3 band through the middle (default), at the bottom, or the whole screen —
   * or one of those per platform.
   */
  frame?: ShotFrame | {android?: ShotFrame; ios?: ShotFrame}
  /** A Maestro flow in `scripts/flows/` that drives the recording (and the still, when it takes one). */
  flow?: string
  /** The platforms the flow is written for — both by default. Elsewhere the shot is a still. */
  flowPlatforms?: readonly ('android' | 'ios')[]
  /** Continuous motion: the length of one loop, in milliseconds. */
  period?: number
  /** Extra time, in milliseconds, for the network before the still — a remote photo arriving late looks settled. */
  settle?: number
  /** Which platforms have this component. Both by default. */
  platforms?: readonly ('android' | 'ios')[]
  /** Discrete motion: how long each step is held, in milliseconds. */
  steps?: readonly number[]
  /** A route of the app to photograph instead of a scene. */
  url?: string
}
