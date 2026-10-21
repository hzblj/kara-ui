import type {ReactNode} from 'react'

export type TooltipProps = {
  children: ReactNode
  text: string
  visible: boolean
  onDismiss: () => void
}

export type TooltipComponent = (props: TooltipProps) => ReactNode
