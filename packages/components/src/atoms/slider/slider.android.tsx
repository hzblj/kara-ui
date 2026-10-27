import {Slider as ComposeSlider} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {haptics} from '@hzblj/expo-rich-haptics'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useEffect, useMemo, useRef} from 'react'

import {useHostGuard} from '../../host-context'
import type {SliderComponent, SliderProps} from './slider.types'

/**
 * Material's slider. `step` is the increment, as SwiftUI takes it; Compose counts the stops between the two ends
 * instead, so it is converted. A stepped slider ticks at every stop the thumb reaches — Compose's Material slider
 * plays nothing of its own, where iOS 26's slider already does. `onValueChangeEnd` is Material's
 * `onValueChangeFinished`, which reports no value: it gets the last one the drag reported.
 */
export const Slider: SliderComponent = ({
  disabled = false,
  max = 1,
  min = 0,
  onValueChange,
  onValueChangeEnd,
  step,
  testID,
  value,
}: SliderProps) => {
  useHostGuard('Slider')
  const theme = useAppTheme()
  const steps = step ? Math.max(0, Math.round((max - min) / step) - 1) : 0

  // The stop is derived from the value rather than trusting it to arrive snapped, and remembered between events:
  // Compose reports faster than React re-renders the controlled value.
  const stopOf = useCallback((at: number) => (step ? Math.round((at - min) / step) : 0), [min, step])
  const stop = useRef(stopOf(value))
  const dragged = useRef<number | undefined>(undefined)

  useEffect(() => {
    stop.current = stopOf(value)
  }, [stopOf, value])

  const onChange = useCallback(
    (next: number) => {
      const reached = stopOf(next)

      if (steps > 0 && reached !== stop.current) {
        haptics.tick()
      }

      stop.current = reached
      dragged.current = next
      onValueChange?.(next)
    },
    [onValueChange, stopOf, steps]
  )

  const onFinished = useCallback(() => {
    const final = dragged.current ?? value
    dragged.current = undefined
    onValueChangeEnd?.(final)
  }, [onValueChangeEnd, value])

  const modifiers = useMemo(() => (testID ? [testIdModifier(testID)] : undefined), [testID])

  return (
    <ComposeSlider
      colors={{
        activeTrackColor: theme.color('fill.accent.primary'),
        thumbColor: theme.color('fill.accent.primary'),
      }}
      enabled={!disabled}
      max={max}
      min={min}
      modifiers={modifiers}
      onValueChange={onChange}
      onValueChangeFinished={onValueChangeEnd ? onFinished : undefined}
      steps={steps}
      value={value}
    />
  )
}
