import type {ReactNode} from 'react'

/**
 * A row that shows and hides its content: SwiftUI's `DisclosureGroup` on iOS; on Android a pressable row with a
 * chevron over an animated reveal. A native atom — it renders inside `<Screen>` or `<Island>`.
 */
export type CollapsibleProps = {
  /** Shown while `expanded`. */
  children: ReactNode
  /** Whether the content is shown. Update it from `onExpandedChange`. */
  expanded: boolean
  /** The row's text. */
  label: string
  /** The user pressed the row; it passes the state the row asks for. */
  onExpandedChange: (expanded: boolean) => void
}

export type CollapsibleComponent = (props: CollapsibleProps) => ReactNode
