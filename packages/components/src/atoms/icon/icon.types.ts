import type {ColorToken, SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type IconName =
  | 'add'
  | 'arrowLeft'
  | 'arrowRight'
  | 'calendar'
  | 'check'
  | 'chevronDown'
  | 'chevronRight'
  | 'close'
  | 'error'
  | 'grid'
  | 'heart'
  | 'home'
  | 'info'
  | 'lock'
  | 'more'
  | 'notification'
  | 'search'
  | 'settings'
  | 'share'
  | 'star'
  | 'trash'
  | 'user'
  | 'warning'

export type IconProps = {
  color?: ColorToken
  name: IconName
  size?: SpaceSize
  testID?: string
}

export type IconComponent = (props: IconProps) => ReactNode
