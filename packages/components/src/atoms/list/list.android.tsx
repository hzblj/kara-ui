import {LazyColumn, PullToRefreshBox} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {Children, Fragment, isValidElement} from 'react'
import {useHostGuard} from '../../host-context'
import {useRefreshState} from '../../use-refresh-state'
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

export const List: ListComponent = ({children, onRefresh}: ListProps) => {
  useHostGuard('List')
  const modifiers = useSxModifiers({wide: true})
  const {isRefreshing, refresh} = useRefreshState(onRefresh)

  const column = <LazyColumn modifiers={modifiers}>{withSeparators(children)}</LazyColumn>

  if (!onRefresh) {
    return column
  }

  return (
    <PullToRefreshBox isRefreshing={isRefreshing} onRefresh={refresh}>
      {column}
    </PullToRefreshBox>
  )
}
