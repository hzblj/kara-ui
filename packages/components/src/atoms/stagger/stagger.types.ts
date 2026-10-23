import type {MotionPreset, MotionPresetConfig, ResponsiveViewSx} from '@hzblj/kara-sx'
import type {DurationSize, SpringName} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/** A preset by name, or one adjusted: `{preset: 'fadeUp', duration: 'slow'}`. Its `delay` is where the first one starts. */
export type StaggerMotion = MotionPreset | MotionPresetConfig

/**
 * A `Box` whose children arrive one after another: each takes `entering` a step later than the one before. Children
 * that arrive together are staggered among themselves, the first ones as much as a later batch (the next page of a
 * list), while a single child added later arrives at once. A `Box`, `RnText` or `Pressable` child takes the motion
 * itself; any other child is wrapped in a `Box` that does. With motion reduced every child fades, still one after
 * another. The React Native tier: it needs no host.
 */
export type StaggerProps = ResponsiveViewSx & {
  /** What arrives. A child with an `entering` preset of its own keeps it and only takes the delay. */
  children?: ReactNode
  /** How each child arrives. `fadeUp` by default. */
  entering?: StaggerMotion
  /** How a child leaves when it is removed. They leave together, not one after another; none by default. */
  exiting?: StaggerMotion
  /** Which end arrives first. `start` by default. */
  from?: 'end' | 'start'
  /** The step between one child and the next, a duration token. `stagger` (40 ms) by default, `micro` for a slower one. */
  interval?: DurationSize
  /**
   * Moves the other children into place when one arrives or leaves, and the stagger itself to its new size: `true` on
   * the `smooth` spring, or a spring token. Off by default. Give what sits after it `layout` too, so it follows.
   */
  layout?: boolean | SpringName
  /** Test identifier, forwarded to the view. */
  testID?: string
}

export type StaggerComponent = (props: StaggerProps) => ReactNode
