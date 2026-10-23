import {Gauge, ProgressView} from '@expo/ui/swift-ui'
import {gaugeStyle, progressViewStyle, tint} from '@expo/ui/swift-ui/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {ProgressComponent, ProgressProps} from './progress.types'

export const Progress: ProgressComponent = ({accessibilityLabel, circular = false, value}: ProgressProps) => {
  useHostGuard('Progress')
  const theme = useAppTheme()
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityLabel})

  const ring = circular && value !== undefined
  const modifiers = useMemo(
    () => [
      ring ? gaugeStyle('circularCapacity') : progressViewStyle(circular ? 'circular' : 'linear'),
      tint(theme.color('fill.accent.primary')),
      ...accessibilityModifiers,
    ],
    [accessibilityModifiers, circular, ring, theme]
  )

  // SwiftUI's circular `ProgressView` ignores its value on iOS and spins; a ring that fills is a capacity `Gauge`.
  return ring ? (
    <Gauge modifiers={modifiers} value={value} />
  ) : (
    <ProgressView modifiers={modifiers} value={value ?? null} />
  )
}
