import {useCallback} from 'react'
import {HStack} from '../../atoms/h-stack'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {GlyphButton} from '../../glyph'
import {useHostGuard} from '../../host-context'
import type {StepperComponent, StepperProps} from './stepper.types'

export const Stepper: StepperComponent = ({
  decrementLabel = 'Decrement',
  disabled = false,
  incrementLabel = 'Increment',
  label,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  onValueChange,
  step = 1,
  testID,
  value,
}: StepperProps) => {
  useHostGuard('Stepper')

  const onDecrement = useCallback(() => onValueChange(Math.max(min, value - step)), [min, onValueChange, step, value])
  const onIncrement = useCallback(() => onValueChange(Math.min(max, value + step)), [max, onValueChange, step, value])
  const color = disabled ? 'content.tertiary' : 'content.primary'

  return (
    <HStack align="center" spacing="s8" wide>
      <Text color={color}>{label}</Text>
      <Spacer />
      {/* The control in a row of its own, the same gap apart, so the id lands on it and not on the label. */}
      <HStack align="center" spacing="s8" testID={testID}>
        <GlyphButton
          accessibilityLabel={decrementLabel}
          disabled={disabled || value <= min}
          name="minus"
          onPress={onDecrement}
        />
        <Text color={color} variant="labelMedium">
          {String(value)}
        </Text>
        <GlyphButton
          accessibilityLabel={incrementLabel}
          disabled={disabled || value >= max}
          name="plus"
          onPress={onIncrement}
        />
      </HStack>
    </HStack>
  )
}
