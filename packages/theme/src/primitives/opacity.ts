/**
 * Alpha, from clear to opaque, for `opacity` and after a colon on a colour token (`fill.accent.base:o50`). Tens, with
 * the quarters and a step in from each end: `o5`–`o10` for a state layer or a faint tint, `o20`–`o40` for a quiet
 * one, `o60`–`o80` for a dim or a scrim, `o85`–`o95` for a surface that is nearly solid.
 */
export const opacity = {
  o0: 0,
  o5: 0.05,
  o10: 0.1,
  o20: 0.2,
  o25: 0.25,
  o30: 0.3,
  o40: 0.4,
  o50: 0.5,
  o60: 0.6,
  o70: 0.7,
  o75: 0.75,
  o80: 0.8,
  o85: 0.85,
  o90: 0.9,
  o95: 0.95,
  o100: 1,
} as const

export type OpacityKeys = keyof typeof opacity

export type OpacitySize = OpacityKeys
