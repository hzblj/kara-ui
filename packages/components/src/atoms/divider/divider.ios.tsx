import {Divider as SwiftUIDivider} from '@expo/ui/swift-ui'
import {background} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {DividerComponent, DividerProps} from './divider.types'

export const Divider: DividerComponent = ({color = 'border.tertiary', testID}: DividerProps) => {
  useHostGuard('Divider')
  const theme = useAppTheme()
  const modifiers = useMemo(() => [background(theme.color(color))], [color, theme])

  return <SwiftUIDivider modifiers={modifiers} testID={testID} />
}
