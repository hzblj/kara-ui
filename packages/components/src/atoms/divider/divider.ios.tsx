import {Divider as SwiftUIDivider} from '@expo/ui/swift-ui'
import {background} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {DividerComponent, DividerProps} from './divider.types'

/**
 * SwiftUI's divider, which turns with its stack: vertical in an `HStack`, horizontal anywhere else. So `axis`, which
 * Android needs to pick its divider, has nothing to do here.
 */
export const Divider: DividerComponent = ({color = 'border.tertiary', testID}: DividerProps) => {
  useHostGuard('Divider')
  const theme = useAppTheme()
  const modifiers = useMemo(() => [background(theme.color(color))], [color, theme])

  return <SwiftUIDivider modifiers={modifiers} testID={testID} />
}
