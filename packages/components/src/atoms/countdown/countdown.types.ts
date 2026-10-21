import type {CountdownUnits} from '@hzblj/kara-native'
import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type {CountdownUnits} from '@hzblj/kara-native'

/**
 * A live countdown — `2d / 05h / 09m / 41s` — drawn natively, so it ticks and rolls its digits without a React render
 * per second. The React Native tier: it sizes itself with an invisible React Native text of the same shape, and lays
 * its own native host over that, so it needs no `Screen` or `Island` around it.
 */
export type CountdownProps = {
  color?: ColorToken
  /** The moment it reaches zero, as a `Date` or epoch milliseconds. It stops there. */
  endsAt: Date | number
  /** Picks the unit initials when `units` is not given. The device's locale by default. */
  locale?: string
  testID?: string
  /** Overrides the locale's unit initials. */
  units?: CountdownUnits
  variant?: TextVariant
}

export type CountdownComponent = (props: CountdownProps) => ReactNode
