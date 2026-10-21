import type {ReactNode} from 'react'

export type AlertProps = {
  confirmLabel?: string
  destructive?: boolean
  message?: string
  onConfirm?: () => void
  onDismiss: () => void
  title: string
  visible: boolean
}

export type AlertComponent = (props: AlertProps) => ReactNode
