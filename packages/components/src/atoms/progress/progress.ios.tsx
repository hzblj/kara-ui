import {ProgressView} from '@expo/ui/swift-ui'
import {progressViewStyle, tint} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {ProgressComponent, ProgressProps} from './progress.types'

export const Progress: ProgressComponent = ({circular = false, value}: ProgressProps) => {
  useHostGuard('Progress')
  const theme = useAppTheme()

  const modifiers = useMemo(
    () => [progressViewStyle(circular ? 'circular' : 'linear'), tint(theme.color('fill.accent.primary'))],
    [circular, theme]
  )

  return <ProgressView modifiers={modifiers} value={value ?? null} />
}
