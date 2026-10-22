import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type VStackAlign = 'center' | 'end' | 'start'

/** Stacks its children top to bottom — SwiftUI `VStack` / Compose `Column`. */
export type VStackProps = ResponsiveSx & {
  /** The children's horizontal alignment. `start` by default. */
  align?: VStackAlign
  /** Laid out top to bottom, `spacing` apart. */
  children?: ReactNode
  /**
   * Makes the whole stack pressable. iOS adds a tap gesture with no press feedback; Android a `clickable` whose ripple
   * fills the stack's shape.
   */
  onPress?: () => void
  /** The space between children. */
  spacing?: SpaceSize
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type VStackComponent = (props: VStackProps) => ReactNode
