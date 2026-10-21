import type {ReactNode} from 'react'

export type SnackbarProps = {
  actionLabel?: string
  message: string
  onAction?: () => void
  visible: boolean
}

export type SnackbarComponent = (props: SnackbarProps) => ReactNode
