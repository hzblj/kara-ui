import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'

/** One action of a `Menu`, an `ActionSheet`, a `ContextMenu` or a `FabMenu`. */
export type MenuAction = {
  /**
   * Draws the action in the destructive colour (the system's destructive role on iOS). `FabMenu` ignores it on
   * Android.
   */
  destructive?: boolean
  /**
   * Greys the action out and stops it responding, for one that does not apply right now: "Paste" with nothing copied.
   * Off by default. `FabMenu` ignores it on Android, where Material's FAB menu items have no disabled state.
   */
  disabled?: boolean
  /**
   * One of the app's icons, before the label. `Menu`, `ContextMenu` and `FabMenu` show it on both platforms,
   * `ActionSheet` on Android only: an iOS confirmation dialog draws text alone.
   */
  icon?: IconName
  /** The action's text. Rows are keyed by it, so keep labels unique within one list. */
  label: string
  /** Called when the action is chosen; the menu closes by itself. */
  onPress: () => void
}

/** What the trigger needs: its text, or an icon and the words a screen reader says for it. */
type MenuTrigger = {label: string} | {accessibilityLabel: string; icon: IconName}

/**
 * A button that opens a list of actions: a SwiftUI `Menu` on iOS, a Material dropdown anchored to it on Android. The
 * trigger is text, an icon and text, or an icon alone. A native atom: it renders inside `<Screen>` or `<Island>`.
 */
export type MenuProps = MenuTrigger & {
  /**
   * What VoiceOver and TalkBack say for the trigger: "More options". Required with an `icon` and no `label`, since an
   * icon has no words of its own. With a label, it replaces the label for screen readers.
   */
  accessibilityLabel?: string
  /** The menu's actions, top to bottom. */
  actions: MenuAction[]
  /**
   * One of the app's icons on the trigger. Before the `label`, in the same colour, when there is one; alone, the
   * trigger is drawn as an `IconButton` (`content.primary`, in a 44pt target on iOS and 48dp on Android) and needs an
   * `accessibilityLabel`.
   */
  icon?: IconName
  /**
   * The trigger's text. Android draws it in the accent colour, with a chevron. Required unless there is an `icon`.
   */
  label?: string
  /** Test identifier, forwarded to the trigger. Reach an action by its label once the menu is open. */
  testID?: string
}

export type MenuComponent = (props: MenuProps) => ReactNode
