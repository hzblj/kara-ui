import type {ReactNode} from 'react'

import type {IconName} from '../icon'

/**
 * A button that is just an icon: a plain SwiftUI `Button` on iOS, Material's `IconButton` on Android. The icon sits
 * centred in a tap target the size each platform asks for, 44pt on iOS and 48dp on Android, so a row of them spaces
 * itself the same way on both.
 */
export type IconButtonProps = {
  /**
   * What VoiceOver and TalkBack say for the button, since an icon has no words of its own: "Share", "Add to
   * favourites". Required for that reason.
   */
  accessibilityLabel: string
  /** What pressing it does, when the label alone does not say. See `AccessibilityProps`. */
  accessibilityHint?: string
  /** Dims the icon (iOS's own disabled look, `btn.content.disabled` on Android) and stops the button responding. */
  disabled?: boolean
  /** The icon, one of the app's. */
  name: IconName
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view on iOS. Android ignores it. */
  testID?: string
}

export type IconButtonComponent = (props: IconButtonProps) => ReactNode
