import type {ReactNode} from 'react'

/**
 * A scrolling list — SwiftUI `List`, Compose `LazyColumn`. It has no height of its own, so it needs one from outside:
 * a `Screen`, or an `Island` with `matchContents={false}` and a height. In an island that sizes itself to its content
 * Compose measures it against an infinite height and throws ("Vertically scrollable component was measured with an
 * infinity maximum height"); SwiftUI shows nothing. For a handful of rows that should not scroll, use a `VStack`.
 *
 * Rows are separated for you — SwiftUI's own separators, a `Divider` between rows on Android — so a `Divider` among
 * the children is one too many: on iOS it becomes an empty row of its own.
 */
export type ListProps = {
  /** The rows — native views, one row each. */
  children: ReactNode
  /**
   * Enables pull-to-refresh. Async on purpose — see `ScrollViewProps.onRefresh`: the spinner runs
   * until the promise settles, so neither platform needs a `refreshing` flag kept in sync by hand.
   */
  onRefresh?: () => Promise<void>
  /** Test identifier, forwarded to the native view on iOS — Android ignores it. */
  testID?: string
}

export type ListComponent = (props: ListProps) => ReactNode
