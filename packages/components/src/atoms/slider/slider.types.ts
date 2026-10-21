import type {ReactNode} from 'react'

export type SliderProps = {
  disabled?: boolean
  max?: number
  min?: number
  onValueChange?: (value: number) => void
  step?: number
  value: number
}

export type SliderComponent = (props: SliderProps) => ReactNode
