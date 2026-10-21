export const zIndex = {
  z0: 0,
  z1: 1,
  z2: 2,
  z3: 3,
  z4: 4,
  z5: 5,
  z6: 6,
  z7: 7,
  z8: 8,
  z9: 9,
  z10: 10,
  z50: 50,
  z100: 100,
} as const

export type ZIndexSize = keyof typeof zIndex
