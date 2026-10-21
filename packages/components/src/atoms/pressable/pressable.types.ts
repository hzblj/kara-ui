import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type PressableProps = ResponsiveViewSx & {
  children?: ReactNode
  disabled?: boolean
  haptic?: boolean
  onPress?: () => void
  testID?: string
}

export type PressableComponent = (props: PressableProps) => ReactNode
