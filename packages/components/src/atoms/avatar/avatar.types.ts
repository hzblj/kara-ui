import type {ReactNode} from 'react'
import type {ImageSourcePropType} from 'react-native'

export type AvatarSize = 'lg' | 'md' | 'sm'

export type AvatarProps = {
  initials?: string
  size?: AvatarSize
  source?: ImageSourcePropType
  testID?: string
}

export type AvatarComponent = (props: AvatarProps) => ReactNode
