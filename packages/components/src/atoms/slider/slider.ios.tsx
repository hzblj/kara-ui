import {Slider as SwiftUISlider} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, tint} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useRef} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {SliderComponent, SliderProps} from './slider.types'

/**
 * SwiftUI's slider. `onValueChangeEnd` is its `onEditingChanged(false)`, with the last value the drag reported: the
 * controlled `value` can still be a render behind when the finger lifts.
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
  const dragged = useRef<number | undefined>(undefined)

  const modifiers = useMemo(() => {
    const list = [tint(theme.color('fill.accent.primary'))]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [disabled, theme])

  const onChange = useCallback(
    (next: number) => {
      dragged.current = next
      onValueChange?.(next)
    },
    [onValueChange]
  )

  const onEditingChanged = useCallback(
    (editing: boolean) => {
      const final = dragged.current ?? value
      dragged.current = undefined

      if (!editing) {
        onValueChangeEnd?.(final)
      }
    },
    [onValueChangeEnd, value]
  )

  return (
    <SwiftUISlider
      max={max}
      min={min}
      modifiers={modifiers}
      onEditingChanged={onValueChangeEnd ? onEditingChanged : undefined}
      onValueChange={onChange}
      step={step}
      testID={testID}
      value={value}
    />
  )
}
