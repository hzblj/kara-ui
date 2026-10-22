import {Stepper as SwiftUIStepper} from '@expo/ui/swift-ui'
import {labelsHidden} from '@expo/ui/swift-ui/modifiers'
import {useRef} from 'react'

import {HStack} from '../../atoms/h-stack'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {useHostGuard} from '../../host-context'
import type {StepperComponent, StepperProps} from './stepper.types'

/** The label stays VoiceOver's, on the control; on screen it is the row's own text. */
const LABEL_HIDDEN = [labelsHidden()]

/**
 * SwiftUI's `Stepper` at the end of a row, the label leading and the value just before the control — the way iOS's own
 * settings show a stepped value. The value rolls to the next one (`numericText`), up or down with the change, in
 * monospaced digits so the row does not jump.
 */
export const Stepper: StepperComponent = ({label, max, min, onValueChange, step = 1, value}: StepperProps) => {
  useHostGuard('Stepper')
  const previous = useRef(value)
  const countsDown = value < previous.current
  previous.current = value

  return (
    <HStack align="center" spacing="s12" wide>
      <Text>{label}</Text>
      <Spacer />
      <Text
        color="content.secondary"
        ios={{animation: {value}, contentTransition: {countsDown, type: 'numericText'}, monospacedDigit: true}}
      >
        {String(value)}
      </Text>
      <SwiftUIStepper
        label={label}
        max={max}
        min={min}
        modifiers={LABEL_HIDDEN}
        onValueChange={onValueChange}
        step={step}
        value={value}
      />
    </HStack>
  )
}
