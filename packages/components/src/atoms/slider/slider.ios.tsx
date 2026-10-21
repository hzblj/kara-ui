import {Slider as SwiftUISlider} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, tint} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

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

  const modifiers = useMemo(() => {
    const list = [tint(theme.color('fill.accent.primary'))]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [disabled, theme])

  return (
    <SwiftUISlider max={max} min={min} modifiers={modifiers} onValueChange={onValueChange} step={step} value={value} />
  )
}
