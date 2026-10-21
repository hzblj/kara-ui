import {List as SwiftUIList} from '@expo/ui/swift-ui'
import {type ModifierConfig, refreshable} from '@expo/ui/swift-ui/modifiers'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {ListComponent, ListProps} from './list.types'

export const List: ListComponent = ({children, onRefresh, testID}: ListProps) => {
  useHostGuard('List')

  const modifiers = useMemo<ModifierConfig[]>(() => (onRefresh ? [refreshable(onRefresh)] : []), [onRefresh])

  return (
    <SwiftUIList modifiers={modifiers} testID={testID}>
      {children}
    </SwiftUIList>
  )
}
