import {Stepper as SwiftUIStepper} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {StepperComponent, StepperProps} from './stepper.types'

export const Stepper: StepperComponent = ({label, max, min, onValueChange, step = 1, value}: StepperProps) => {
  useHostGuard('Stepper')

  return <SwiftUIStepper label={label} max={max} min={min} onValueChange={onValueChange} step={step} value={value} />
}
