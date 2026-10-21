import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/** Opens an external URL in the platform browser or the app that claims the scheme. */
export type LinkProps = {
  color?: ColorToken
  icon?: IconName
  label: string
  testID?: string
  url: string
  variant?: TextVariant
}

export type LinkComponent = (props: LinkProps) => ReactNode
