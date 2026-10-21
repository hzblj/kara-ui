import type {ColorValue} from 'react-native'

import type {TextWeight} from './text-weight'

/** Unit labels in order, appended to their values: `['d', 'h', 'm', 's']` reads `2d / 05h / 09m / 41s`. */
export type CountdownUnits = readonly [days: string, hours: string, minutes: string, seconds: string]

export type NativeCountdownProps = {
  color: ColorValue
  /** Opacity of the `/` between segments, relative to `color`. Defaults to 0.35. */
  dividerOpacity?: number
  /** Epoch milliseconds. */
  endsAt: number
  /** A registered font's PostScript/file name. The system face when unset. */
  fontFamily?: string
  fontSize: number
  /** Applied to the system face only — a custom face carries its own weight. */
  fontWeight?: TextWeight
  letterSpacing?: number
  lineHeight?: number
  units: CountdownUnits
}
