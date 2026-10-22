import {useSx} from '@hzblj/kara-sx'
import {createContext, useCallback, useContext, useMemo} from 'react'
import {ScrollView} from 'react-native'

import type {SheetScrollContextValue, SheetScrollHandler, SheetScrollViewProps} from './sheet.types'

export const SheetScrollContext = createContext<SheetScrollContextValue | null>(null)

/**
 * For a scroll view of your own inside a sheet (a `RnFlatList`, say): pad its content by `topInset`, render
 * `largeTitle` first, and forward `onScroll` — which is what `<Sheet.ScrollView>` does.
 */
export const useSheetScroll = (): SheetScrollContextValue => {
  const context = useContext(SheetScrollContext)

  if (context === null) {
    throw new Error('[kara-ui] useSheetScroll and <Sheet.ScrollView> must be used inside <Sheet>.')
  }

  return context
}

const NO_SX = {}

/** The sheet's scrolling body: starts below the header on iOS 26, carries a large title, and reports its scroll. */
export const SheetScrollView = ({
  children,
  content,
  keyboardShouldPersistTaps,
  onScroll,
  testID,
}: SheetScrollViewProps) => {
  const {largeTitle, onScroll: onSheetScroll, topInset} = useSheetScroll()
  const contentStyle = useSx(content ?? NO_SX)
  // The header's room goes on top of the content's own top padding, not in place of it.
  const containerStyle = useMemo(() => {
    if (topInset === 0) {
      return contentStyle
    }

    const ownTop = typeof contentStyle.paddingTop === 'number' ? contentStyle.paddingTop : 0

    return [contentStyle, {paddingTop: topInset + ownTop}]
  }, [contentStyle, topInset])

  const handleScroll = useCallback<SheetScrollHandler>(
    event => {
      onSheetScroll?.(event)
      onScroll?.(event)
    },
    [onScroll, onSheetScroll]
  )

  return (
    <ScrollView
      contentContainerStyle={containerStyle}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      nestedScrollEnabled
      onScroll={onSheetScroll || onScroll ? handleScroll : undefined}
      overScrollMode="always"
      scrollEventThrottle={16}
      testID={testID}
    >
      {largeTitle}
      {children}
    </ScrollView>
  )
}
