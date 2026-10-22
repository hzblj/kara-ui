import type {ReactNode} from 'react'

import type {IconName} from '../icon'

/**
 * A floating action button — Material's `FloatingActionButton` on Android, a 56pt accent circle (a plain SwiftUI
 * `Button`) on iOS. It renders inline; pinning it to a corner is up to the screen.
 */
export type FabProps = {
  /** The icon, one of the app's, drawn in `content.on.bg`. */
  name: IconName
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view on iOS — Android ignores it. */
  testID?: string
}

export type FabComponent = (props: FabProps) => ReactNode
