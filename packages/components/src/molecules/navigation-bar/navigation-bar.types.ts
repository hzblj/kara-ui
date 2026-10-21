import type {ReactNode} from 'react'

/**
 * A title with back and close items, for a sheet that is not a navigation screen. On iOS a standalone
 * `UINavigationBar`, so the items press and render exactly like a native-stack header's — on iOS 26 they share the
 * bar's glass instead of swelling as standalone glass buttons do. On Android a Material row of icon buttons. The React
 * Native tier: it needs no host.
 */
export type NavigationBarProps = {
  /** The back item's accessibility label. `Back` by default. */
  backLabel?: string
  /** iOS: the back item's accessibility identifier. */
  backTestID?: string
  /** The close item's accessibility label. `Close` by default. */
  closeLabel?: string
  /** iOS: the close item's accessibility identifier. */
  closeTestID?: string
  /** Shows the back item. */
  onBack?: () => void
  /** Shows the close item. */
  onClose?: () => void
  testID?: string
  title?: string
}

export type NavigationBarComponent = (props: NavigationBarProps) => ReactNode
