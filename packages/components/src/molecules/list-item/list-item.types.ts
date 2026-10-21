import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

export type ListItemProps = {
  icon?: IconName
  onPress?: () => void
  subtitle?: string
  testID?: string
  title: string
}

export type ListItemComponent = (props: ListItemProps) => ReactNode
