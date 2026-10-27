import type {ReactNode} from 'react'

import type {MenuAction} from '../menu'

/**
 * A list of actions to pick one from: SwiftUI's confirmation dialog on iOS, a `Sheet` of Material rows (icon and label)
 * under the title and message on Android. A native atom: it renders inside `<Screen>` or `<Island>`.
 */
export type ActionSheetProps = {
  /** The choices, top to bottom. Picking one closes the sheet. A `disabled` one stays in the list, greyed. */
  actions: MenuAction[]
  /**
   * A line under the title saying what the choice is about: "The photo will be removed from all your devices." Unset,
   * the title stands alone.
   */
  message?: string
  /** The sheet closed (after a pick too), so turn `visible` off. */
  onDismiss: () => void
  /** The heading above the actions, shown on both platforms. */
  title: string
  /** Presents the sheet while true. */
  visible: boolean
}

export type ActionSheetComponent = (props: ActionSheetProps) => ReactNode
