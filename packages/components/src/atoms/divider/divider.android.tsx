import {HorizontalDivider} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {DividerComponent, DividerProps} from './divider.types'

export const Divider: DividerComponent = ({color = 'border.tertiary'}: DividerProps) => {
  useHostGuard('Divider')
  const theme = useAppTheme()

  return <HorizontalDivider color={theme.color(color)} />
}
