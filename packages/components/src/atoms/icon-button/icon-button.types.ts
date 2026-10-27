import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../icon'

/**
 * How much the button stands out: just the icon (`plain`), on a fill in the accent (`filled`), on a muted fill
 * (`tonal`), in a ring (`outlined`) or on Liquid Glass (`glass`).
 */
export type IconButtonVariant = 'filled' | 'glass' | 'outlined' | 'plain' | 'tonal'

/**
 * A button that is just an icon: a SwiftUI `Button` on iOS, one of Material's icon buttons on Android. A `plain` one
 * sits centred in a tap target the size each platform asks for, 44pt on iOS and 48dp on Android, so a row of them
 * spaces itself the same way on both; the other variants draw a circle around the icon.
 */
export type IconButtonProps = {
  /**
   * What VoiceOver and TalkBack say for the button, since an icon has no words of its own: "Share", "Add to
   * favourites". Required for that reason.
   */
  accessibilityLabel: string
  /** What pressing it does, when the label alone does not say. See `AccessibilityProps`. */
  accessibilityHint?: string
  /**
   * The icon's colour, `content.primary` by default. On `filled` it is the fill instead (`fill.accent.primary` by
   * default) and the icon picks a colour that reads on it, as a `Button`'s `tint` does on a prominent style. On iOS a
   * `tonal` button's circle takes a pale shade of it too.
   */
  color?: ColorToken
  /** Dims the icon (iOS's own disabled look, `btn.content.disabled` on Android) and stops the button responding. */
  disabled?: boolean
  /** The icon, one of the app's. */
  name: IconName
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /**
   * The look. `plain` by default. iOS draws the others as SwiftUI button styles in a circle: `borderedProminent` for
   * `filled`, `bordered` for `tonal`, `glass` for `glass` (`bordered` below iOS 26), and `outlined` as a plain button
   * in a hairline ring. Android draws Material's `IconButton`, `FilledIconButton`, `FilledTonalIconButton` and
   * `OutlinedIconButton`; Material has no glass, so there `glass` is the tonal one.
   */
  variant?: IconButtonVariant
}

export type IconButtonComponent = (props: IconButtonProps) => ReactNode
