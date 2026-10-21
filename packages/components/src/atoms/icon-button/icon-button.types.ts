import type {ReactNode} from 'react'

import type {IconName} from '../icon'

export type IconButtonProps = {
  disabled?: boolean
  name: IconName
  onPress?: () => void
  testID?: string
}

export type IconButtonComponent = (props: IconButtonProps) => ReactNode
