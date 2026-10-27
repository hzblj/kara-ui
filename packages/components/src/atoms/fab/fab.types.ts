import type {ReactNode} from 'react'

import type {IconName} from '../icon'

/** Material's three floating action buttons: 40, 56 and 96 across. */
export type FabSize = 'large' | 'regular' | 'small'

/**
 * A floating action button: Material's `FloatingActionButton` on Android, an accent circle (a plain SwiftUI `Button`)
 * on iOS. With a `label` it is the extended one, the icon and the text side by side: Material's
 * `ExtendedFloatingActionButton`, an accent capsule on iOS. It renders inline; pinning it to a corner is up to the
 * screen.
 */
export type FabProps = {
  /**
   * What VoiceOver and TalkBack say for the button, since an icon has no words of its own: "Share", "Add to
   * favourites". Required for that reason. With a `label` it is still what they say, in place of the label, so give
   * it the label's words (or words that start with them), and Voice Control finds the button by what it shows.
   */
  accessibilityLabel: string
  /** What pressing it does, when the label alone does not say. See `AccessibilityProps`. */
  accessibilityHint?: string
  /**
   * Text beside the icon, which makes it an extended FAB: "Compose", "New post". For a screen whose main action needs
   * its words. Material's `ExtendedFloatingActionButton` on Android; on iOS the same accent, 56pt tall, as a capsule.
   */
  label?: string
  /** The icon, one of the app's, drawn in `content.on.accent`. */
  name: IconName
  /** Called when the button is pressed. */
  onPress?: () => void
  /**
   * `regular` by default, 56 across. `small` is 40, for a secondary action beside a regular one; `large` is 96, with a
   * 36 icon, for a screen built around one action. Material's `SmallFloatingActionButton` and
   * `LargeFloatingActionButton` on Android, the same sizes of circle on iOS. A FAB with a `label` has one size and
   * ignores it.
   */
  size?: FabSize
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type FabComponent = (props: FabProps) => ReactNode
