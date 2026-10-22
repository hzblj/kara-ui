import type {ColorToken, SpaceSize, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/**
 * An inline icon + text pair — the thing you put inside a button, a menu row or a section
 * header. For a full tappable row with a subtitle and chevron, use `ListItem`.
 */
export type LabelProps = {
  /** Colours the icon and the title alike. `content.primary` by default. */
  color?: ColorToken
  /** One of the app's icons, before the title. */
  icon: IconName
  /** The icon's size. `s20` by default. */
  iconSize?: SpaceSize
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** The text beside the icon. */
  title: string
  /** The title's text style. `body` by default. */
  variant?: TextVariant
}

export type LabelComponent = (props: LabelProps) => ReactNode
