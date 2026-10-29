import {Group, List as SwiftUIList} from '@expo/ui/swift-ui'
import {listRowSeparator, listStyle, type ModifierConfig, refreshable} from '@expo/ui/swift-ui/modifiers'
import {contentScrollView} from '@hzblj/kara-native/swift-ui'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {ListComponent, ListProps} from './list.types'

/**
 * `listRowSeparator` is a row's preference, not the list's: set on the `List` it reaches no row. A `Group` hands a
 * modifier to each of its children, so the rows go in one, and each of them hides its own separator.
 */
const NO_SEPARATORS = [listRowSeparator('hidden')]

export const List: ListComponent = ({
  children,
  onRefresh,
  separators = true,
  testID,
  variant = 'insetGrouped',
}: ListProps) => {
  useHostGuard('List')

  const modifiers = useMemo<ModifierConfig[]>(
    () => [listStyle(variant), contentScrollView(), ...(onRefresh ? [refreshable(onRefresh)] : [])],
    [onRefresh, variant]
  )

  return (
    <SwiftUIList modifiers={modifiers} testID={testID}>
      {separators ? children : <Group modifiers={NO_SEPARATORS}>{children}</Group>}
    </SwiftUIList>
  )
}
