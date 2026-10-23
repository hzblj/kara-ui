import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'
import type {MenuAction} from '../menu'

/**
 * A context menu on a React Native subtree (a card in a list, say), opened by a long press. iOS: a
 * `UIContextMenuInteraction`, with an optional React Native `preview` lifted while the menu is open and a callback for
 * a tap on it. Android, where Material has no lifted preview: a ripple and the long-press haptic, then a Material
 * dropdown where the finger is, with the trigger highlighted while it is open. The trigger is ordinary React Native layout, so it
 * needs no `Screen` or `Island`.
 */
export type ContextMenuProps = ResponsiveViewSx & {
  /** The menu's actions, top to bottom. */
  actions: MenuAction[]
  /** The trigger, laid out as usual. */
  children: ReactNode
  /** iOS: the user tapped the lifted preview, committing to it. Open the detail the card stands for. */
  onPreviewPress?: () => void
  /**
   * iOS: lifted in place of the trigger while the menu is open (a larger version of the card, say). A snapshot of the
   * trigger when unset. Mounted only once a finger has rested on the trigger, so a list of cards does not pay for
   * every preview up front.
   */
  preview?: ReactNode
  /**
   * iOS: how the preview leaves once tapped, before `onPreviewPress`. `zoom`: its photo grows straight into the pushed
   * screen, the way the App Store expands a preview. It needs a `ZoomTransition.Source` (`@hzblj/kara-ui/router`) in
   * the trigger, a `preview` and iOS 18, and shrinks back like `dismiss` otherwise. `pop`: UIKit's default, the preview
   * flies out. `dismiss`: it shrinks back onto the trigger first. Default: `zoom` when the trigger holds a
   * `ZoomTransition.Source`, `pop` otherwise.
   */
  previewTransition?: 'dismiss' | 'pop' | 'zoom'
  /** Test identifier: on the native view around the trigger on iOS, on the trigger's `Pressable` on Android. */
  testID?: string
}

/** A region of a `ContextMenu`'s trigger that keeps its own long press (see `ContextMenu.Exclusion`). */
export type ContextMenuExclusionProps = {
  /** The region: a button inside the card, say. */
  children: ReactNode
}

export type ContextMenuComponent = ((props: ContextMenuProps) => ReactNode) & {
  /**
   * A region of the trigger that must not open the menu: a button inside the card. On iOS the interaction covers the
   * whole trigger, so a long press on that button would otherwise open the card's menu.
   */
  Exclusion: (props: ContextMenuExclusionProps) => ReactNode
}
