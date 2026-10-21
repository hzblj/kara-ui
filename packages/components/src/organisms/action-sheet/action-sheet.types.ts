import type {ReactNode} from 'react'

import type {MenuAction} from '../menu'

export type ActionSheetProps = {
  actions: MenuAction[]
  onDismiss: () => void
  title: string
  visible: boolean
}

export type ActionSheetComponent = (props: ActionSheetProps) => ReactNode
