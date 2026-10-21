import {Stepper as Android} from './stepper.android'
import {Stepper as Ios} from './stepper.ios'
import type {StepperComponent} from './stepper.types'

export const _ios: StepperComponent = Ios
export const _android: StepperComponent = Android
