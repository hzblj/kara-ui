import {Stepper as SwiftUIStepper} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, labelsHidden} from '@expo/ui/swift-ui/modifiers'
import {useReducedMotion} from '@hzblj/kara-theme'
import {useRef} from 'react'

import {HStack} from '../../atoms/h-stack'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {useHostGuard} from '../../hooks/host-context'
import type {StepperComponent, StepperProps} from './stepper.types'

/** The label stays VoiceOver's, on the control; on screen it is the row's own text. */
const LABEL_HIDDEN = [labelsHidden()]

const LABEL_HIDDEN_DISABLED = [labelsHidden(), disabledModifier(true)]

/**
 * SwiftUI's `Stepper` at the end of a row, the label leading and the value just before the control — the way iOS's own
 * settings show a stepped value. The value rolls to the next one (`numericText`), up or down with the change, in
 * monospaced digits so the row does not jump. With motion reduced it cross-fades instead. Its buttons are labelled by
 * the system, so `decrementLabel` and `incrementLabel` are Android's alone.
 */
export const Stepper: StepperComponent = ({
  disabled = false,
  label,
  max,
  min,
  onValueChange,
  step = 1,
  testID,
  value,
}: StepperProps) => {
  useHostGuard('Stepper')
  const reduced = useReducedMotion()
  const previous = useRef(value)
  const countsDown = value < previous.current
  previous.current = value

  return (
    <HStack align="center" spacing="s12" wide>
      <Text color={disabled ? 'content.tertiary' : 'content.primary'}>{label}</Text>
      <Spacer />
      <Text
        color={disabled ? 'content.tertiary' : 'content.secondary'}
        ios={{
          animation: {value},
          contentTransition: reduced ? {type: 'opacity'} : {countsDown, type: 'numericText'},
        }}
        monospacedDigit
      >
        {String(value)}
      </Text>
      {/* iOS 27 stops a disabled stepper but draws its buttons at full strength. Pinned to its value, UIKit greys
          both buttons, as it greys one at a limit. */}
      <SwiftUIStepper
        label={label}
        max={disabled ? value : max}
        min={disabled ? value : min}
        modifiers={disabled ? LABEL_HIDDEN_DISABLED : LABEL_HIDDEN}
        onValueChange={onValueChange}
        step={step}
        testID={testID}
        value={value}
      />
    </HStack>
  )
}
