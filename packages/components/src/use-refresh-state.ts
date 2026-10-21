import {useCallback, useState} from 'react'

export type RefreshState = {
  isRefreshing: boolean
  refresh: () => void
}

/**
 * Bridges the two platforms' opposite takes on pull-to-refresh so both can expose one async
 * `onRefresh`. SwiftUI's `refreshable` takes the promise and spins until it settles, so iOS hands the
 * handler straight over; Compose's `PullToRefreshBox` is controlled and keeps spinning until
 * `isRefreshing` goes false, which is the flag this derives.
 *
 * Errors are left to the caller: `Promise.resolve().then` turns even a synchronous throw into a
 * rejection the caller still sees, while `finally` stops the spinner either way. Swallowing it here
 * would leave a failed refresh looking like a successful one.
 */
export const useRefreshState = (onRefresh: (() => Promise<void>) | undefined): RefreshState => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = useCallback(() => {
    if (!onRefresh) {
      return
    }

    setIsRefreshing(true)

    void Promise.resolve()
      .then(onRefresh)
      .finally(() => setIsRefreshing(false))
  }, [onRefresh])

  return {isRefreshing, refresh}
}
