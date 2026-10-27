import {LazyColumn, PullToRefreshBox} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {Children, Fragment, isValidElement, useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {useRefreshState} from '../../use-refresh-state'
import {Card} from '../card'
import {Divider} from '../divider'
import type {ListComponent, ListProps} from './list.types'

/** A divider between rows, the separator SwiftUI's `List` draws on its own — so rows are written the same for both. */
const withSeparators = (children: ListProps['children']) =>
  Children.toArray(children).map((child, index) => (
    <Fragment key={isValidElement(child) && child.key !== null ? child.key : index}>
      {index > 0 ? <Divider /> : null}
      {child}
    </Fragment>
  ))

/** The card's inset from the column's edges, as `Form` keeps its cards off the screen's. */
const INSET = {bottom: spacing.s16, end: spacing.s16, start: spacing.s16, top: spacing.s16}

/**
 * `plain` is the column as it always was. `insetGrouped` sets the rows in one `Card`, the way `Form` draws a section,
 * inset by the column's content padding: the card is a single item of the column, so its rows are composed together
 * rather than as they scroll in. A long list that wants laziness stays `plain`.
 */
export const List: ListComponent = ({children, onRefresh, separators = true, testID, variant = 'plain'}: ListProps) => {
  useHostGuard('List')
  const sxModifiers = useSxModifiers({wide: true})
  // On the column, not the refresh box around it: the column is what scrolls.
  const modifiers = useMemo(
    () => (testID ? [...sxModifiers, testIdModifier(testID)] : sxModifiers),
    [sxModifiers, testID]
  )
  const {isRefreshing, refresh} = useRefreshState(onRefresh)
  const rows = separators ? withSeparators(children) : children
  const grouped = variant === 'insetGrouped'

  const column = (
    <LazyColumn contentPadding={grouped ? INSET : undefined} modifiers={modifiers}>
      {grouped && Children.toArray(children).length > 0 ? <Card wide>{rows}</Card> : rows}
    </LazyColumn>
  )

  if (!onRefresh) {
    return column
  }

  return (
    <PullToRefreshBox isRefreshing={isRefreshing} onRefresh={refresh}>
      {column}
    </PullToRefreshBox>
  )
}
