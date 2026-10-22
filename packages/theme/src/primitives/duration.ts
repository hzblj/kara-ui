export const duration = {
  d0: 0,
  d50: 50,
  d100: 100,
  d150: 150,
  d200: 200,
  d250: 250,
  d300: 300,
  d350: 350,
  d400: 400,
  d450: 450,
  d500: 500,
  d600: 600,
  d700: 700,
  d800: 800,
  d1000: 1000,
  d1500: 1500,
  d2000: 2000,
  d3000: 3000,
  d5000: 5000,
  d10000: 10000,
} as const

export type DurationSize = keyof typeof duration
