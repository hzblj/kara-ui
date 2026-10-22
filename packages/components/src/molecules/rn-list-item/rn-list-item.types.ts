import type {ReactNode} from 'react'

import type {ListItemProps} from '../list-item'

/**
 * `ListItem`'s row in the React Native tier — plain views, no host. For lists long enough that a native host per row
 * would cost too much to mount (a navigation list, an `RnFlatList` of rows), with the platform's own press feedback: a
 * ripple across the whole row on Android, a highlight on iOS. In a rounded card, give the card `overflow="hidden"`:
 * Android draws the ripple as the row's foreground, which only a parent's clip keeps inside rounded corners.
 */
export type RnListItemProps = ListItemProps

export type RnListItemComponent = (props: RnListItemProps) => ReactNode
