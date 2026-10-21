import type {ReactNode} from 'react'

export type ProgressProps = {
  circular?: boolean
  value?: number
}

export type ProgressComponent = (props: ProgressProps) => ReactNode
