/**
 * Points, on a 4 pt grid: half steps (`s2`, `s6`, `s10`) where small gaps need them, every 4 pt from `s12` to `s40`,
 * then wider steps for sections and screens. `s1` is a hairline.
 */
export const spacing = {
  s0: 0,
  s1: 1,
  s2: 2,
  s4: 4,
  s6: 6,
  s8: 8,
  s10: 10,
  s12: 12,
  s16: 16,
  s20: 20,
  s24: 24,
  s28: 28,
  s32: 32,
  s36: 36,
  s40: 40,
  s48: 48,
  s56: 56,
  s64: 64,
  s72: 72,
  s80: 80,
  s96: 96,
} as const

export type SpaceSize = keyof typeof spacing
