import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'
import type {MenuAction} from '../menu'

/**
 * A floating action button that unfolds into its actions. Android: Material 3 Expressive's `FloatingActionButtonMenu`
 * — the button turns into a close and the actions rise above it as labelled pills. iOS: the same button as the label
 * of a SwiftUI `Menu`. A native atom — it renders inside `<Screen>` or `<Island>`.
 */
export type FabMenuProps = {
  actions: MenuAction[]
  /** The closed button's icon. `add` by default. */
  icon?: IconName
  testID?: string
}

export type FabMenuComponent = (props: FabMenuProps) => ReactNode
