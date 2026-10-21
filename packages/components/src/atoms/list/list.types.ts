import type {ReactNode} from 'react'

export type ListProps = {
  children: ReactNode
  /**
   * Enables pull-to-refresh. Async on purpose — see `ScrollViewProps.onRefresh`: the spinner runs
   * until the promise settles, so neither platform needs a `refreshing` flag kept in sync by hand.
   */
  onRefresh?: () => Promise<void>
  testID?: string
}

export type ListComponent = (props: ListProps) => ReactNode
