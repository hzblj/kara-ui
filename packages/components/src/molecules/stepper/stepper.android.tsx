import {useCallback} from 'react'
import {HStack} from '../../atoms/h-stack'
import {IconButton} from '../../atoms/icon-button'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {useHostGuard} from '../../host-context'
import type {StepperComponent, StepperProps} from './stepper.types'

export const Stepper: StepperComponent = ({
  label,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  onValueChange,
  step = 1,
  value,
}: StepperProps) => {
  useHostGuard('Stepper')

  const onDecrement = useCallback(() => onValueChange(Math.max(min, value - step)), [min, onValueChange, step, value])
  const onIncrement = useCallback(() => onValueChange(Math.min(max, value + step)), [max, onValueChange, step, value])

  return (
    <HStack align="center" spacing="s8" wide>
      <Text>{label}</Text>
      <Spacer />
      <IconButton disabled={value <= min} name="close" onPress={onDecrement} />
      <Text variant="labelMedium">{String(value)}</Text>
      <IconButton disabled={value >= max} name="add" onPress={onIncrement} />
    </HStack>
  )
}
