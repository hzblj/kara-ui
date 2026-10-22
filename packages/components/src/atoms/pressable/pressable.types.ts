import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

import type {Haptic} from '../../haptics'

export type PressableProps = ResponsiveViewSx & {
  children?: ReactNode
  disabled?: boolean
  /** Played on press. `true` is a `light` impact; a name picks the haptic, e.g. `selection` for a choice. */
  haptic?: boolean | Haptic
  onPress?: () => void
  testID?: string
}

export type PressableComponent = (props: PressableProps) => ReactNode
