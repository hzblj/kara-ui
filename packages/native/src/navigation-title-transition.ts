/** A named easing curve, or cubic bézier control points `[x1, y1, x2, y2]` as CSS writes them. */
export type NavigationTitleEasing = 'easeIn' | 'easeInOut' | 'easeOut' | 'linear' | [number, number, number, number]

/** How a line moves into place: a spring, or a fixed duration with an easing. */
export type NavigationTitleTiming =
  | {
      /** Below 1 the line overshoots and bounces back; 1 settles without overshoot. 1 by default. */
      dampingFraction?: number
      /** Roughly how long it takes to settle, in seconds: lower is snappier. 0.4 by default. */
      response?: number
      type: 'spring'
    }
  | {
      /** In seconds. 0.35 by default. */
      duration?: number
      /** `easeOut` by default. */
      easing?: NavigationTitleEasing
      type: 'timing'
    }

/** Where one line (the title or the subtitle) starts, before it moves into place. Anything left out keeps the preset's. */
export type NavigationTitleLineMotion = {
  /** Blur radius in points. */
  blur?: number
  /** Seconds before the line starts. */
  delay?: number
  /** Points below its place; negative starts above. */
  offset?: number
  /** Starting scale, 1 for none. */
  scale?: number
  /** How the line moves into place. Replaces the preset's curves. */
  timing?: NavigationTitleTiming
}

/**
 * - `rise` (default): Mail's title on iOS 26. Each line rises from below, sharpening out of a blur; the subtitle trails.
 * - `blur`: the same, in place.
 * - `fade`: a plain fade, the subtitle a little slower.
 * - `none`: no animation.
 */
export type NavigationTitleTransitionPreset = 'blur' | 'fade' | 'none' | 'rise'

export type NavigationTitleTransitionConfig = {
  /** When the title hides: `reverse` plays the entry backwards, `none` hides it at once. `reverse` by default. */
  exit?: 'none' | 'reverse'
  /** The preset to start from. `rise` by default. */
  preset?: NavigationTitleTransitionPreset
  /** The subtitle's motion. */
  subtitle?: NavigationTitleLineMotion
  /** The title's motion. */
  title?: NavigationTitleLineMotion
}

/** How a title and its subtitle come in when they are revealed: a preset, or a preset with your own adjustments. */
export type NavigationTitleTransition = NavigationTitleTransitionConfig | NavigationTitleTransitionPreset
