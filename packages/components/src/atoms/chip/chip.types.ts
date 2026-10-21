import type {ReactNode} from 'react'

export type ChipProps = {
  label: string
  onPress?: () => void
  selected?: boolean
  testID?: string
}

export type ChipComponent = (props: ChipProps) => ReactNode
