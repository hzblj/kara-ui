import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type HStackAlign = 'center' | 'end' | 'start'

/** A horizontal stack — SwiftUI `HStack` / Compose `Row`. */
export type HStackProps = ResponsiveSx & {
  /** How the children line up vertically — `start` is the top, `end` the bottom. `start` by default. */
  align?: HStackAlign
  /** Native views, laid out from the leading edge. */
  children?: ReactNode
  /** Makes the stack pressable — a tap gesture on iOS, a `clickable` with Material's ripple on Android. */
  onPress?: () => void
  /** The gap between children. Unset, SwiftUI puts its default spacing between them and Compose none. */
  spacing?: SpaceSize
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type HStackComponent = (props: HStackProps) => ReactNode
