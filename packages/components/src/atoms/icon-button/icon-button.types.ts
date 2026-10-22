import type {ReactNode} from 'react'

import type {IconName} from '../icon'

/** A button that is just an icon — a plain SwiftUI `Button` on iOS, Material's `IconButton` on Android. */
export type IconButtonProps = {
  /** Draws the icon in `btn.content.disabled` and stops the button responding to presses. */
  disabled?: boolean
  /** The icon, one of the app's. */
  name: IconName
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view on iOS — Android ignores it. */
  testID?: string
}

export type IconButtonComponent = (props: IconButtonProps) => ReactNode
