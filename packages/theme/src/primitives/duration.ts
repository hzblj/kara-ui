/**
 * How long a timed animation takes, transitions.dev's scale: `micro` < `quick` < `fast` < `medium` < `slow` <
 * `verySlow`, with `stagger` for the offset between items and `none` for no motion at all. Pick a step by what the
 * motion does, never by the number: a sheet closing is `quick` whatever it took before. Two rules ride on the scale:
 * leaving is shorter than arriving, and what a finger drags is a spring, not a duration.
 */
export const duration = {
  /** 250 ms: something arriving. A snackbar, a menu, a chevron turning, an icon swapped for another. */
  fast: 250,
  /** 350 ms: a larger surface leaving. A panel or a toast closing. */
  medium: 350,
  /** 80 ms: what answers a touch. A press dimming, a highlight. Also a long stagger. */
  micro: 80,
  /** 0 ms: a change that should not animate at all. */
  none: 0,
  /** 150 ms: something leaving or swapped in place. A close, a fade out, a press letting go, a tint filling. */
  quick: 150,
  /** 400 ms: a larger surface arriving. A panel opening, loaded content replacing its skeleton. */
  slow: 400,
  /** 40 ms: the offset between items that come in one after another. */
  stagger: 40,
  /** 500 ms: an emphasised moment. A success check, a badge appearing, a container transform. */
  verySlow: 500,
} as const

export type DurationSize = keyof typeof duration
