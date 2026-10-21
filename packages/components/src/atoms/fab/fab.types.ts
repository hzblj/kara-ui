import type {ReactNode} from 'react'

import type {IconName} from '../icon'

export type FabProps = {
  name: IconName
  onPress?: () => void
  testID?: string
}

export type FabComponent = (props: FabProps) => ReactNode
