/**
 * The curves timed motion follows, as cubic-bézier control points (`x1, y1, x2, y2`), transitions.dev's set.
 * `smoothOut` is the one to reach for: arriving and leaving alike, a fast start and a long settle, so the change is
 * visible at once and lands softly. `Easing.bezier(...easing.smoothOut)` in Reanimated, `cubic-bezier(...)` on the web.
 */
export const easing = {
  /** One thing swapped for another in place: an icon, a text, loaded content over its skeleton. */
  inOut: [0.42, 0, 0.58, 1],
  /** Constant speed: what loops. A pulse, a shimmer, a spinner. */
  linear: [0, 0, 1, 1],
  /** A small, plain fade or tint: a press letting go, a tooltip. */
  out: [0, 0, 0.58, 1],
  /** Opening and closing, moving and resizing: a menu, a sheet, a snackbar, a page. */
  smoothOut: [0.22, 1, 0.36, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>

export type EasingName = keyof typeof easing
