import {Slider as ComposeSlider} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {SliderComponent, SliderProps} from './slider.types'

export const Slider: SliderComponent = ({
  disabled = false,
  max = 1,
  min = 0,
  onValueChange,
  step,
  value,
}: SliderProps) => {
  useHostGuard('Slider')
  const theme = useAppTheme()

  return (
    <ComposeSlider
      colors={{
        activeTrackColor: theme.color('fill.accent.primary'),
        thumbColor: theme.color('fill.accent.primary'),
      }}
      enabled={!disabled}
      max={max}
      min={min}
      onValueChange={onValueChange}
      steps={step}
      value={value}
    />
  )
}
