import type {AccessibilityProps, ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type ZStackAlign = 'bottom' | 'center' | 'top'

/** Layers its children on one another: SwiftUI `ZStack` / Compose `Box`. */
export type ZStackProps = ResponsiveSx &
  AccessibilityProps & {
    /** Where the children sit vertically; they are always centred horizontally. `center` by default. */
    align?: ZStackAlign
    /** Drawn in order, the last on top. */
    children?: ReactNode
    /**
     * Makes the whole stack pressable. iOS adds a tap gesture with no press feedback; Android a `clickable` whose ripple
     * fills the stack's shape. Screen readers then read the stack as one button.
     */
    onPress?: () => void
    /** Test identifier, forwarded to the native view. */
    testID?: string
  }

export type ZStackComponent = (props: ZStackProps) => ReactNode
