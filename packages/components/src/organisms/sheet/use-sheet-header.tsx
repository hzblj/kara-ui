import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {spacing} from '@hzblj/kara-theme'
import {useCallback, useMemo, useRef, useState} from 'react'
import {type LayoutChangeEvent, Platform, type ViewStyle} from 'react-native'

import {Box} from '../../atoms/box'
import {RnText} from '../../atoms/rn-text'
import {NavigationBar, type NavigationBarTitleAlignment} from '../../molecules/navigation-bar'
import {SEARCH_ROW_HEIGHT} from '../../molecules/navigation-bar/navigation-bar.constants'
import type {SheetHeaderProps, SheetScrollContextValue, SheetScrollHandler} from './sheet.types'

type UseSheetHeaderParams = {
  header?: SheetHeaderProps
  scrollable: boolean
}

/** The bar's own height (`NavigationBar`) plus the room above it, before the header has been measured. */
const ESTIMATED_HEADER_HEIGHT = (Platform.OS === 'ios' ? 56 : 64) + spacing.s16

/** Where a large title's bar title appears once it has scrolled away: the platform's own place for it. */
const COLLAPSED_TITLE_ALIGNMENT: NavigationBarTitleAlignment = Platform.OS === 'ios' ? 'center' : 'leading'

/** Lays the header over the content so the content can scroll under it — the edge effect needs it there. */
const OVERLAY_HEADER_STYLE: ViewStyle = {left: 0, position: 'absolute', right: 0, top: 0, zIndex: 1}

const SOFT_EDGE_EFFECTS = {bottomScrollEdgeEffect: 'soft', topScrollEdgeEffect: 'soft'} as const

const SheetLargeTitle = ({onLayout, title}: {onLayout: (event: LayoutChangeEvent) => void; title: string}) => (
  <Box onLayout={onLayout} pb="s8" pt="s8" px="s16">
    <RnText accessibilityRole="header" variant="headingM">
      {title}
    </RnText>
  </Box>
)

/**
 * Turns `<Sheet.Header>`'s props into what the native sheet takes: its header element, how that is laid out, the scroll
 * edge effects, and the context a `<Sheet.ScrollView>` reads. On iOS 26 a scrollable sheet's header is laid over the
 * content (which is then inset by the header's measured height) so the system's soft edge blurs what scrolls under it;
 * everywhere else the header simply sits above the content.
 */
export const useSheetHeader = ({header: headerProps, scrollable}: UseSheetHeaderParams) => {
  const title = headerProps?.title
  const titleStyle = headerProps?.titleStyle ?? 'center'
  const leadingItems = headerProps?.leadingItems
  const trailingItems = headerProps?.trailingItems
  const inverted = headerProps?.inverted
  const search = headerProps?.search
  const accessory = headerProps?.children
  const hasBar = title !== undefined || !!leadingItems?.length || !!trailingItems?.length || !!search
  const searchRowHeight =
    Platform.OS === 'ios' && search && search.placement !== 'integratedButton' ? SEARCH_ROW_HEIGHT : 0
  const hasHeader = hasBar || !!accessory
  const isOverlay = isScrollEdgeEffectAvailable() && hasHeader && scrollable
  const isLargeTitle = titleStyle === 'large' && !!title

  const [headerHeight, setHeaderHeight] = useState(hasBar ? ESTIMATED_HEADER_HEIGHT + searchRowHeight : 0)
  const [largeTitleScrolledAway, setLargeTitleScrolledAway] = useState(false)
  const largeTitleHeight = useRef(0)

  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height)
  }, [])

  const handleLargeTitleLayout = useCallback((event: LayoutChangeEvent) => {
    largeTitleHeight.current = event.nativeEvent.layout.height
  }, [])

  const handleScroll = useCallback<SheetScrollHandler>(event => {
    if (largeTitleHeight.current === 0) {
      return
    }

    setLargeTitleScrolledAway(event.nativeEvent.contentOffset.y >= largeTitleHeight.current)
  }, [])

  const titleAlignment: NavigationBarTitleAlignment = titleStyle === 'large' ? COLLAPSED_TITLE_ALIGNMENT : titleStyle
  const titleVisible = !isLargeTitle || (scrollable && largeTitleScrolledAway)

  const headerElement = useMemo(() => {
    if (!hasHeader) {
      return undefined
    }

    return (
      <Box onLayout={isOverlay ? handleHeaderLayout : undefined} pt="s16">
        {hasBar ? (
          <NavigationBar
            inverted={inverted}
            leadingItems={leadingItems}
            search={search}
            title={title}
            titleAlignment={titleAlignment}
            titleVisible={titleVisible}
            trailingItems={trailingItems}
          />
        ) : null}
        {accessory}
      </Box>
    )
  }, [
    accessory,
    handleHeaderLayout,
    hasBar,
    hasHeader,
    inverted,
    isOverlay,
    leadingItems,
    search,
    title,
    titleAlignment,
    titleVisible,
    trailingItems,
  ])

  const largeTitle = useMemo(
    () => (title && isLargeTitle ? <SheetLargeTitle onLayout={handleLargeTitleLayout} title={title} /> : null),
    [handleLargeTitleLayout, isLargeTitle, title]
  )

  const scrollContext = useMemo<SheetScrollContextValue>(
    () => ({
      largeTitle: scrollable ? largeTitle : null,
      onScroll: scrollable && isLargeTitle ? handleScroll : undefined,
      topInset: isOverlay ? headerHeight : 0,
    }),
    [handleScroll, headerHeight, isLargeTitle, isOverlay, largeTitle, scrollable]
  )

  return {
    header: headerElement,
    headerStyle: isOverlay ? OVERLAY_HEADER_STYLE : undefined,
    scrollableOptions: isOverlay ? SOFT_EDGE_EFFECTS : undefined,
    scrollContext,
    /** Without a scroll view to carry it, a large title simply leads the content. */
    staticLargeTitle: scrollable ? null : largeTitle,
  }
}
