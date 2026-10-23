import type {AccessibilityProps, ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type VStackAlign = 'center' | 'end' | 'start'

/** Stacks its children top to bottom: SwiftUI `VStack` / Compose `Column`. */
export type VStackProps = ResponsiveSx &
  AccessibilityProps & {
    /** The children's horizontal alignment. `start` by default. */
    align?: VStackAlign
    /** Laid out top to bottom, `spacing` apart. */
    children?: ReactNode
    /**
     * Makes the whole stack pressable. iOS adds a tap gesture with no press feedback; Android a `clickable` whose ripple
     * fills the stack's shape. Screen readers then read the stack as one button.
     */
    onPress?: () => void
    /** The space between children. */
    spacing?: SpaceSize
    /** Test identifier, forwarded to the native view. */
    testID?: string
  }

export type VStackComponent = (props: VStackProps) => ReactNode
