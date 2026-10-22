import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

import type {Haptic} from '../../haptics'

/**
 * React Native's `Pressable`, styled through `sx` like a `Box`: it springs down to 96% while pressed and takes
 * touches 8 points past its edges. The React Native tier — it needs no host.
 */
export type PressableProps = ResponsiveViewSx & {
  /** The pressable content. */
  children?: ReactNode
  /** Ignores presses — no `onPress`, no haptic, no spring. */
  disabled?: boolean
  /** Played on press. `true` is a `light` impact; a name picks the haptic, e.g. `selection` for a choice. */
  haptic?: boolean | Haptic
  /** Called when the press is released, after the `haptic` plays. */
  onPress?: () => void
  /** Test identifier, forwarded to the view. */
  testID?: string
}

export type PressableComponent = (props: PressableProps) => ReactNode
