import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'
import type {MenuAction} from '../menu'

/**
 * A context menu on a React Native subtree — a card in a list, say — opened by a long press. iOS: a
 * `UIContextMenuInteraction`, with an optional React Native `preview` lifted while the menu is open and a callback for
 * a tap on it. Android: a Material dropdown under the subtree. The trigger is ordinary React Native layout, so it
 * needs no `Screen` or `Island`.
 */
export type ContextMenuProps = ResponsiveViewSx & {
  actions: MenuAction[]
  /** The trigger, laid out as usual. */
  children: ReactNode
  /** iOS: the user tapped the lifted preview, committing to it — open the detail the card stands for. */
  onPreviewPress?: () => void
  /**
   * iOS: lifted in place of the trigger while the menu is open — a larger version of the card, say. A snapshot of the
   * trigger when unset. Mounted only once a finger has rested on the trigger, so a list of cards does not pay for
   * every preview up front.
   */
  preview?: ReactNode
  testID?: string
}

export type ContextMenuExclusionProps = {
  children: ReactNode
}

export type ContextMenuComponent = ((props: ContextMenuProps) => ReactNode) & {
  /**
   * A region of the trigger that must not open the menu — a button inside the card. On iOS the interaction covers the
   * whole trigger, so a long press on that button would otherwise open the card's menu.
   */
  Exclusion: (props: ContextMenuExclusionProps) => ReactNode
}
