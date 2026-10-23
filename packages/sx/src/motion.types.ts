import type {DurationSize, EasingName, SpaceSize, SpringName} from '@hzblj/kara-theme'
import type {BaseAnimationBuilder, EntryOrExitLayoutType, LayoutAnimationFunction} from 'react-native-reanimated'

/**
 * How a box arrives or leaves, named by the way it moves: `fadeUp` rises into place (or floats away upward), `fadeDown`
 * settles from above (or sinks away), `scale` grows from a little smaller (or shrinks), `fade` only fades. With motion
 * reduced every one of them is a fade.
 */
export type MotionPreset = 'fade' | 'fadeDown' | 'fadeUp' | 'scale'

/** A preset with its timing adjusted. Every field is a token except `delay`, which is what a stagger computes. */
export type MotionPresetConfig = {
  /** Milliseconds before it starts. */
  delay?: number
  /** How far `fadeUp` and `fadeDown` travel. `s12` by default. */
  distance?: SpaceSize
  /** Arriving takes `fast` and leaving `quick` unless told otherwise. */
  duration?: DurationSize
  /** `smoothOut` by default. */
  easing?: EasingName
  preset: MotionPreset
  /** Moves on a spring instead of a duration and a curve: `bouncy` for a pop. `duration` and `easing` are ignored. */
  spring?: SpringName
}

/** Reanimated's own entering or exiting: a preset class (`FadeIn`), a configured builder, a `Keyframe` or a worklet. */
export type ReanimatedEntryExit = EntryOrExitLayoutType

/** Reanimated's own layout transition: `LinearTransition`, `FadingTransition`, a configured builder or a worklet. */
export type ReanimatedLayout = BaseAnimationBuilder | LayoutAnimationFunction | typeof BaseAnimationBuilder

/** What `entering` and `exiting` take: a kara preset by name, a preset adjusted, or Reanimated's own. */
export type SxEntryExit = MotionPreset | MotionPresetConfig | ReanimatedEntryExit

/** A layout transition on a duration and a curve, or on a spring, which wins when both are given. */
export type SxLayoutConfig = {
  duration?: DurationSize
  easing?: EasingName
  spring?: SpringName
}

/**
 * What `layout` takes: `true` for kara's (into place on the `smooth` spring), a spring token, a timed config, or
 * Reanimated's own transition.
 */
export type SxLayout = boolean | ReanimatedLayout | SpringName | SxLayoutConfig

/**
 * The `sx` keys `animate` can carry over to their next value. `offsetX`, `offsetY`, `rotate` and `scale` all ride one
 * transform, so naming any of them animates the four.
 */
export type AnimatableKey =
  | 'bg'
  | 'blur'
  | 'borderColor'
  | 'borderRadius'
  | 'borderWidth'
  | 'h'
  | 'maxH'
  | 'maxW'
  | 'minH'
  | 'minW'
  | 'offsetX'
  | 'offsetY'
  | 'opacity'
  | 'rotate'
  | 'scale'
  | 'w'

/** `animate` in full: which keys, and on what timing. */
export type SxAnimateConfig = {
  /** Milliseconds before a change starts moving. */
  delay?: number
  /** `fast` unless told otherwise. */
  duration?: DurationSize
  /** `smoothOut` unless told otherwise. */
  easing?: EasingName
  /**
   * The keys that animate. The colours, `opacity` and the transform unless told otherwise: what the compositor moves
   * without laying anything out. Sizes go through layout on every frame, so they animate only when named.
   */
  keys?: readonly AnimatableKey[]
  /** Moves on a spring instead of a duration and a curve. `duration` and `easing` are ignored. */
  spring?: SpringName
}

/** `true` for the defaults (`fast`, `smoothOut`), a duration token, a spring token, or the full config. */
export type SxAnimate = boolean | DurationSize | SpringName | SxAnimateConfig

/**
 * The motion every `sx` view takes. Any of them makes the view a Reanimated one by itself, so there is no animated twin
 * to import: a `Box` with `entering` is an `Animated.View`, a plain `Box` stays a `View` and costs nothing more.
 */
export type MotionProps = {
  /**
   * Carries every change to the keys it covers over to the new value, on the UI thread: change `opacity`, `bg` or
   * `offsetY` and the box moves there instead of jumping. Reanimated's CSS transitions underneath. With motion reduced
   * only the colours and `opacity` animate; the rest arrives at once.
   */
  animate?: SxAnimate
  /**
   * Renders through Reanimated from the first frame. A view decides when it mounts, so this is for one whose animated
   * `style` or motion arrives later. An animated `style` present at mount is noticed without it.
   */
  animated?: boolean
  /** How the view arrives when it mounts. A preset (`'fadeUp'`), a preset adjusted, or Reanimated's own builder. */
  entering?: SxEntryExit
  /** How the view leaves when it is the one removed. Takes what `entering` does. */
  exiting?: SxEntryExit
  /**
   * Animates the view to its new place and size when the layout around it changes: `true` on the `smooth` spring, or a
   * spring token, a timed config or Reanimated's own. kara's are off with motion reduced.
   */
  layout?: SxLayout
}
