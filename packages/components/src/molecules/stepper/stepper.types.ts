import type {ReactNode} from 'react'

export type StepperProps = {
  label: string
  max?: number
  min?: number
  onValueChange: (value: number) => void
  step?: number
  value: number
}

export type StepperComponent = (props: StepperProps) => ReactNode
