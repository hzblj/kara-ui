import type {ReactNode} from 'react'

export type SheetProps = {
  children: ReactNode
  fitToContents?: boolean
  onDismiss: () => void
  visible: boolean
}

export type SheetComponent = (props: SheetProps) => ReactNode
