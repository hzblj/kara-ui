export const radii = {
  /** Pill / circle — larger than any realistic half-height, so the shape stays fully rounded. */
  full: 999,
  large: 16,
  medium: 12,
  none: 0,
  small: 8,
} as const

export type RadiiSize = keyof typeof radii
