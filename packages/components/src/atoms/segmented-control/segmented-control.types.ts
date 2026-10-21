import type {ReactNode} from 'react'

export type SegmentedControlProps = {
  disabled?: boolean
  onChange?: (index: number, value: string) => void
  selectedIndex: number
  testID?: string
  values: string[]
}

export type SegmentedControlComponent = (props: SegmentedControlProps) => ReactNode
