import {TabView} from '@expo/ui/swift-ui'
import {type ModifierConfig, tabViewStyle} from '@expo/ui/swift-ui/modifiers'
import {Children, useCallback, useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {PagerComponent, PagerProps} from './pager.types'

export const Pager: PagerComponent = ({children, indicators = true, onPageChange, page, testID}: PagerProps) => {
  useHostGuard('Pager')

  const modifiers = useMemo<ModifierConfig[]>(
    () => [tabViewStyle({indexDisplayMode: indicators ? 'always' : 'never', type: 'page'})],
    [indicators]
  )

  const onSelectionChange = useCallback((value: string) => onPageChange?.(Number(value)), [onPageChange])

  /**
   * A `TabView` identifies its pages by string, so each child's index stands in as its value. The
   * component also demands at least one element, hence the guard below.
   */
  const tabs = Children.toArray(children).map((child, index) => (
    <TabView.Tab key={index} value={String(index)}>
      {child}
    </TabView.Tab>
  ))

  if (tabs.length === 0) {
    return null
  }

  return (
    <TabView
      defaultSelection="0"
      modifiers={modifiers}
      onSelectionChange={onSelectionChange}
      selection={page === undefined ? undefined : String(page)}
      testID={testID}
    >
      {tabs}
    </TabView>
  )
}
