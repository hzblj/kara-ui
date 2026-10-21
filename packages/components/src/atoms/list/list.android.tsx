import {LazyColumn, PullToRefreshBox} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useHostGuard} from '../../host-context'
import {useRefreshState} from '../../use-refresh-state'
import type {ListComponent, ListProps} from './list.types'

export const List: ListComponent = ({children, onRefresh}: ListProps) => {
  useHostGuard('List')
  const modifiers = useSxModifiers({wide: true})
  const {isRefreshing, refresh} = useRefreshState(onRefresh)

  const column = <LazyColumn modifiers={modifiers}>{children}</LazyColumn>

  if (!onRefresh) {
    return column
  }

  return (
    <PullToRefreshBox isRefreshing={isRefreshing} onRefresh={refresh}>
      {column}
    </PullToRefreshBox>
  )
}
