import type {ReactNode} from 'react'

export type DatePickerMode = 'date' | 'datetime' | 'time'

export type DatePickerProps = {
  max?: Date
  min?: Date
  mode?: DatePickerMode
  onValueChange?: (date: Date) => void
  testID?: string
  value: Date
}

export type DatePickerComponent = (props: DatePickerProps) => ReactNode
