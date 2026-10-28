import {type RefObject, useMemo} from 'react'
import {Platform} from 'react-native'

import type {HeaderScrollable, HeaderScrollToTopOptions, HeaderScrollToTopRef} from './header.types'
import {useHeaderBarInset} from './use-header-bar-inset'

/** The row iOS gives a large title, which the top of a large-title screen includes. */
const LARGE_TITLE_HEIGHT = 52

const scrollToOffset = (target: HeaderScrollable, offset: number) => {
  if ('scrollToOffset' in target) {
    target.scrollToOffset({animated: true, offset})
    return
  }

  if ('scrollTo' in target) {
    target.scrollTo({animated: true, y: offset})
    return
  }

  target.getScrollResponder()?.scrollTo({animated: true, y: offset})
}

/**
 * A ref for React Navigation's or Expo Router's `useScrollToTop`: pressing the tab again scrolls the list back under a
 * transparent header, with a large title expanded, where scrolling to 0 would leave the content under the bar and the
 * title collapsed. `useScrollToTop(useHeaderScrollToTop(listRef, {largeTitle: true}))`.
 */
export const useHeaderScrollToTop = (
  ref: RefObject<HeaderScrollable | null>,
  {largeTitle = false, topInset = 0}: HeaderScrollToTopOptions = {}
): HeaderScrollToTopRef => {
  const barInset = useHeaderBarInset()
  const offset = Platform.OS === 'ios' ? -(barInset + (largeTitle ? LARGE_TITLE_HEIGHT : 0) + topInset) : 0

  return useMemo(
    () => ({
      current: {
        scrollToTop: () => {
          if (ref.current) {
            scrollToOffset(ref.current, offset)
          }
        },
      },
    }),
    [offset, ref]
  )
}
