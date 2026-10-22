import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

export type ListItemProps = {
  icon?: IconName
  onPress?: () => void
  /**
   * Horizontal padding inside the row — inside its press area too, so Android's ripple reaches the card's edges. For
   * rows in a card of your own; a `List` insets its rows by itself.
   */
  px?: SpaceSize
  subtitle?: string
  testID?: string
  title: string
}

export type ListItemComponent = (props: ListItemProps) => ReactNode
