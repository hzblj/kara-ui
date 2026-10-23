import {CircularProgressIndicator, LinearProgressIndicator} from '@expo/ui/jetpack-compose'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {ProgressComponent, ProgressProps} from './progress.types'

export const Progress: ProgressComponent = ({accessibilityLabel, circular = false, value}: ProgressProps) => {
  useHostGuard('Progress')
  const theme = useAppTheme()
  const color = theme.color('fill.accent.primary')
  const modifiers = useAccessibilityModifiers({accessibilityLabel})

  if (circular) {
    return <CircularProgressIndicator color={color} modifiers={modifiers} progress={value} />
  }

  return <LinearProgressIndicator color={color} modifiers={modifiers} progress={value} />
}
