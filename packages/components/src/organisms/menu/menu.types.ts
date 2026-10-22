import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/** One action of a `Menu`, an `ActionSheet`, a `ContextMenu` or a `FabMenu`. */
export type MenuAction = {
  /**
   * Draws the action in the destructive colour — the system's destructive role on iOS. `FabMenu` ignores it on
   * Android.
   */
  destructive?: boolean
  /**
   * One of the app's icons, before the label. `ContextMenu` and `FabMenu` show it on both platforms, `Menu` and
   * `ActionSheet` on Android only.
   */
  icon?: IconName
  /** The action's text. Rows are keyed by it, so keep labels unique within one list. */
  label: string
  /** Called when the action is chosen; the menu closes by itself. */
  onPress: () => void
}

/**
 * A text button that opens a list of actions: a SwiftUI `Menu` on iOS, a Material dropdown anchored to it on Android.
 * A native atom — it renders inside `<Screen>` or `<Island>`.
 */
export type MenuProps = {
  /** The menu's actions, top to bottom. */
  actions: MenuAction[]
  /** The trigger's text. Android draws it in the accent colour, with a chevron. */
  label: string
}

export type MenuComponent = (props: MenuProps) => ReactNode
