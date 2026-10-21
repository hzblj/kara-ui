import type {ReactNode} from 'react'

export type PickerOption = {
  label: string
  value: string
}

export type PickerProps = {
  disabled?: boolean
  onValueChange?: (value: string) => void
  options: PickerOption[]
  testID?: string
  value: string
}

export type PickerComponent = (props: PickerProps) => ReactNode
