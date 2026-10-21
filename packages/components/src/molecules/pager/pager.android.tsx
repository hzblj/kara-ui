import {HorizontalPager, type HorizontalPagerHandle} from '@expo/ui/jetpack-compose'
import {fillMaxSize, type ModifierConfig, testID as testIdModifier, weight} from '@expo/ui/jetpack-compose/modifiers'
import {spacing} from '@hzblj/kara-theme'
import {Children, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {HStack} from '../../atoms/h-stack'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {PagerComponent, PagerProps} from './pager.types'

const DOT_SIZE = 6

/** Compose ships no page indicator, so the dots are composed out of atoms. */
const PagerDots = ({count, current}: {count: number; current: number}) => (
  <HStack align="center" py="s12" spacing="s6" wide>
    {Array.from({length: count}, (_, index) => (
      <VStack
        bg={index === current ? 'content.primary' : 'fill.tertiary'}
        borderRadius="full"
        h={DOT_SIZE}
        key={index}
        w={DOT_SIZE}
      />
    ))}
  </HStack>
)

export const Pager: PagerComponent = ({
  children,
  indicators = true,
  onPageChange,
  page,
  pageSpacing,
  scrollEnabled = true,
  testID,
}: PagerProps) => {
  useHostGuard('Pager')

  const pagerRef = useRef<HorizontalPagerHandle>(null)
  const settledPage = useRef(page ?? 0)
  const [currentPage, setCurrentPage] = useState(page ?? 0)

  /**
   * Compose reads `initialPage` only at mount, so a controlled `page` has to be driven through the
   * ref. Guarded on the last settled page: without it, the `onSettledPageChange` this component just
   * reported would come back as a fresh `page` and re-scroll to where the pager already is.
   */
  useEffect(() => {
    if (page === undefined || page === settledPage.current) {
      return
    }

    settledPage.current = page
    void pagerRef.current?.animateScrollToPage(page)
  }, [page])

  const onSettledPageChange = useCallback(
    (next: number) => {
      settledPage.current = next
      onPageChange?.(next)
    },
    [onPageChange]
  )

  // `weight` only means anything inside the Column the indicators add; standalone, the pager fills.
  const modifiers = useMemo<ModifierConfig[]>(
    () => [indicators ? weight(1) : fillMaxSize(), ...(testID ? [testIdModifier(testID)] : [])],
    [indicators, testID]
  )

  const pager = (
    <HorizontalPager
      initialPage={page ?? 0}
      modifiers={modifiers}
      onCurrentPageChange={indicators ? setCurrentPage : undefined}
      onSettledPageChange={onSettledPageChange}
      pageSpacing={pageSpacing === undefined ? undefined : spacing[pageSpacing]}
      ref={pagerRef}
      userScrollEnabled={scrollEnabled}
    >
      {children}
    </HorizontalPager>
  )

  if (!indicators) {
    return pager
  }

  return (
    <VStack tall wide>
      {pager}
      <PagerDots count={Children.count(children)} current={currentPage} />
    </VStack>
  )
}
