import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

/**
 * A raised container: SwiftUI `VStack` / Compose `Column` on `surface.primary`, with a large radius, `s16` padding and
 * the `card` shadow. Any `sx` prop overrides its default.
 */
export type CardProps = ResponsiveSx & {
  /** Native views, stacked vertically from the leading edge. */
  children?: ReactNode
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type CardComponent = (props: CardProps) => ReactNode
