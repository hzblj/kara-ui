import type {ReactNode} from 'react'
import type {ImageSourcePropType} from 'react-native'

export type AvatarSize = 'lg' | 'md' | 'sm'

/** A round avatar: the image in `source`, or `initials` without one. The React Native tier — it needs no host. */
export type AvatarProps = {
  /** Shown in place of the image when there is no `source`. */
  initials?: string
  /** The diameter — `sm` is `s24`, `md` `s40`, `lg` `s64`. `md` by default. */
  size?: AvatarSize
  /** The image, cropped to the circle. */
  source?: ImageSourcePropType
  /** Test identifier, forwarded to the view. */
  testID?: string
}

export type AvatarComponent = (props: AvatarProps) => ReactNode
