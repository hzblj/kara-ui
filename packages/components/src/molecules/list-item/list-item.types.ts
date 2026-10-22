import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/**
 * A row with an optional icon, a title and subtitle, and a chevron when it can be pressed. A native atom — it renders
 * inside `<Screen>` or `<Island>`; `RnListItem` is the same row without a host.
 */
export type ListItemProps = {
  /** One of the app's icons, before the title, in the secondary colour. */
  icon?: IconName
  /** Makes the row pressable and adds a chevron on the trailing edge. */
  onPress?: () => void
  /**
   * Horizontal padding inside the row — inside its press area too, so Android's ripple reaches the card's edges. For
   * rows in a card of your own; a `List` insets its rows by itself.
   */
  px?: SpaceSize
  /** A second line under the title, smaller and in the secondary colour. */
  subtitle?: string
  /** Test identifier, forwarded to the row's view. */
  testID?: string
  /** The row's main text. */
  title: string
}

export type ListItemComponent = (props: ListItemProps) => ReactNode
