import {Column, PullToRefreshBox, Row} from '@expo/ui/jetpack-compose'
import {
  horizontalScroll,
  type ModifierConfig,
  testID as testIdModifier,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {useRefreshState} from '../../use-refresh-state'
import type {ScrollViewComponent, ScrollViewProps} from './scroll-view.types'

export const ScrollView: ScrollViewComponent = ({
  axis = 'vertical',
  children,
  onRefresh,
  spacing: gap,
  testID,
  ...sx
}: ScrollViewProps) => {
  useHostGuard('ScrollView')

  const arrangement = gap === undefined ? undefined : {spacedBy: spacing[gap]}
  const sxModifiers = useSxModifiers(sx)
  const {isRefreshing, refresh} = useRefreshState(onRefresh)
  const modifiers = useMemo<ModifierConfig[]>(
    () => [
      ...sxModifiers,
      axis === 'horizontal' ? horizontalScroll() : verticalScroll(),
      ...(testID ? [testIdModifier(testID)] : []),
    ],
    [axis, sxModifiers, testID]
  )

  if (axis === 'horizontal') {
    return (
      <Row horizontalArrangement={arrangement} modifiers={modifiers}>
        {children}
      </Row>
    )
  }

  const column = (
    <Column modifiers={modifiers} verticalArrangement={arrangement}>
      {children}
    </Column>
  )

  // Unlike SwiftUI's modifier, Compose's pull-to-refresh is a container — so it wraps rather than
  // joining `modifiers`, and is left out entirely when nobody asked for it.
  if (!onRefresh) {
    return column
  }

  return (
    <PullToRefreshBox isRefreshing={isRefreshing} onRefresh={refresh}>
      {column}
    </PullToRefreshBox>
  )
}
