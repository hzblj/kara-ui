import type {AccessibilityProps} from '@hzblj/kara-sx'
import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/** Opens an external URL in the platform browser or the app that claims the scheme. */
export type LinkProps = AccessibilityProps & {
  /** Colours the label and the icon. `content.accent` by default. */
  color?: ColorToken
  /** One of the app's icons, before the label. */
  icon?: IconName
  /** The link's text. */
  label: string
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** Opened through React Native's `Linking` on press. A URL nothing can open fails silently. */
  url: string
  /** The label's text style. `body` by default. */
  variant?: TextVariant
}

export type LinkComponent = (props: LinkProps) => ReactNode
