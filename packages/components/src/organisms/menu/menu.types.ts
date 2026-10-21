import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

export type MenuAction = {
  destructive?: boolean
  icon?: IconName
  label: string
  onPress: () => void
}

export type MenuProps = {
  actions: MenuAction[]
  label: string
}

export type MenuComponent = (props: MenuProps) => ReactNode
