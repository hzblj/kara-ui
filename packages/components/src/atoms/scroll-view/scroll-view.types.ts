import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type ScrollViewAxis = 'horizontal' | 'vertical'

/**
 * The `sx` props style the scrolling *content* container, not the viewport — `p` behaves
 * like React Native's `contentContainerStyle` padding and scrolls with the content.
 */
export type ScrollViewProps = ResponsiveSx & {
  axis?: ScrollViewAxis
  children?: ReactNode
  /**
   * Enables pull-to-refresh. Async on purpose: the spinner runs until the promise settles, which is
   * what SwiftUI's `refreshable` expects and what Compose's controlled indicator is driven from — so
   * neither platform needs a separate `refreshing` flag to be kept in sync by the caller.
   *
   * Only a vertical scroll view can be pulled; on a horizontal one both platforms ignore it.
   */
  onRefresh?: () => Promise<void>
  /** iOS only — Compose exposes no indicator toggle, so Android always shows the native one. */
  showsIndicators?: boolean
  spacing?: SpaceSize
  testID?: string
}

export type ScrollViewComponent = (props: ScrollViewProps) => ReactNode
