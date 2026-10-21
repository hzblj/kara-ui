import type {ColorToken, SpaceSize, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/**
 * An inline icon + text pair — the thing you put inside a button, a menu row or a section
 * header. For a full tappable row with a subtitle and chevron, use `ListItem`.
 */
export type LabelProps = {
  color?: ColorToken
  icon: IconName
  iconSize?: SpaceSize
  testID?: string
  title: string
  variant?: TextVariant
}

export type LabelComponent = (props: LabelProps) => ReactNode
