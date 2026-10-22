import type {ReactNode} from 'react'

import type {MenuAction} from '../menu'

/**
 * A list of actions to pick one from: SwiftUI's confirmation dialog on iOS, a `Sheet` of Material rows — icon and label
 * — under the title on Android. A native atom — it renders inside `<Screen>` or `<Island>`.
 */
export type ActionSheetProps = {
  /** The choices, top to bottom. Picking one closes the sheet. */
  actions: MenuAction[]
  /** The sheet closed — after a pick too — so turn `visible` off. */
  onDismiss: () => void
  /** The heading above the actions. Android always shows it; on iOS the system decides, and may hide it. */
  title: string
  /** Presents the sheet while true. */
  visible: boolean
}

export type ActionSheetComponent = (props: ActionSheetProps) => ReactNode
