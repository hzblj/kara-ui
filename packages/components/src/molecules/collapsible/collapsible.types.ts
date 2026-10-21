import type {ReactNode} from 'react'

export type CollapsibleProps = {
  children: ReactNode
  expanded: boolean
  label: string
  onExpandedChange: (expanded: boolean) => void
}

export type CollapsibleComponent = (props: CollapsibleProps) => ReactNode
