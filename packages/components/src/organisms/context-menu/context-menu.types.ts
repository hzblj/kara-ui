import type {ReactNode} from 'react'

import type {MenuAction} from '../menu'

export type ContextMenuProps = {
  actions: MenuAction[]
  children: ReactNode
}

export type ContextMenuComponent = (props: ContextMenuProps) => ReactNode
