import type {ReactNode} from 'react'

export type SwitchProps = {
  disabled?: boolean
  label?: string
  onValueChange?: (value: boolean) => void
  value: boolean
}

export type SwitchComponent = (props: SwitchProps) => ReactNode
