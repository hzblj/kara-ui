import type {ReactNode} from 'react'

export type RadioOption = {
  label: string
  value: string
}

export type RadioGroupProps = {
  onValueChange?: (value: string) => void
  options: RadioOption[]
  value: string
}

export type RadioGroupComponent = (props: RadioGroupProps) => ReactNode
