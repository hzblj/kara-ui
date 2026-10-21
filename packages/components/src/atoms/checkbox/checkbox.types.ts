import type {ReactNode} from 'react'

export type CheckboxProps = {
  disabled?: boolean
  label?: string
  onValueChange?: (value: boolean) => void
  value: boolean
}

export type CheckboxComponent = (props: CheckboxProps) => ReactNode
