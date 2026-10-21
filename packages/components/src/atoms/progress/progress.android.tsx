import {CircularProgressIndicator, LinearProgressIndicator} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {ProgressComponent, ProgressProps} from './progress.types'

export const Progress: ProgressComponent = ({circular = false, value}: ProgressProps) => {
  useHostGuard('Progress')
  const theme = useAppTheme()
  const color = theme.color('fill.accent.primary')

  if (circular) {
    return <CircularProgressIndicator color={color} progress={value} />
  }

  return <LinearProgressIndicator color={color} progress={value} />
}
