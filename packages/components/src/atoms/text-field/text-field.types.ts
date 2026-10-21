import type {ReactNode} from 'react'

export type TextFieldProps = {
  defaultValue?: string
  disabled?: boolean
  error?: boolean
  label?: string
  multiline?: boolean
  onChangeText?: (text: string) => void
  secure?: boolean
  testID?: string
}

export type TextFieldComponent = (props: TextFieldProps) => ReactNode
