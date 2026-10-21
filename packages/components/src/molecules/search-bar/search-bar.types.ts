import type {ReactNode} from 'react'

export type SearchBarProps = {
  onChangeText?: (text: string) => void
  placeholder?: string
  testID?: string
  value: string
}

export type SearchBarComponent = (props: SearchBarProps) => ReactNode
