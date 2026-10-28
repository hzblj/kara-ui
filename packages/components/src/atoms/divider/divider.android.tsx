import {HorizontalDivider, VerticalDivider} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {DividerComponent, DividerProps} from './divider.types'

/**
 * Compose's dividers. Unlike SwiftUI's, a Compose divider does not turn with its stack, so `axis` picks the one:
 * `VerticalDivider` fills the height of the `Row` around it.
 */
export const Divider: DividerComponent = ({axis = 'horizontal', color = 'border.tertiary', testID}: DividerProps) => {
  useHostGuard('Divider')
  const theme = useAppTheme()
  const modifiers = useMemo(() => (testID ? [testIdModifier(testID)] : undefined), [testID])

  return axis === 'vertical' ? (
    <VerticalDivider color={theme.color(color)} modifiers={modifiers} />
  ) : (
    <HorizontalDivider color={theme.color(color)} modifiers={modifiers} />
  )
}
