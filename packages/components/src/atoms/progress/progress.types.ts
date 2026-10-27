import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * A progress bar or ring, tinted `fill.accent.primary` unless `color` names another: SwiftUI `ProgressView` (a capacity
 * `Gauge` for a ring with a value, which `ProgressView` cannot draw on iOS) / Compose's `LinearProgressIndicator` and
 * `CircularProgressIndicator`.
 */
export type ProgressProps = {
  /** What is in progress, for VoiceOver and TalkBack: "Uploading". They read how far along it is themselves. */
  accessibilityLabel?: string
  /** A circular indicator instead of a bar. Off by default. */
  circular?: boolean
  /**
   * Its colour: `fill.destructive.primary` for storage nearly full, `fill.success.primary` for a goal reached.
   * `fill.accent.primary` by default. iOS tints the bar or ring with it. Android draws the indicator in it and, for any
   * colour but the accent, the track in the same colour faded (Material's own track stays under the accent, and an
   * indeterminate ring has none).
   */
  color?: ColorToken
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** Between `0` and `1`. Leave it unset for an indeterminate indicator. */
  value?: number
}

export type ProgressComponent = (props: ProgressProps) => ReactNode
