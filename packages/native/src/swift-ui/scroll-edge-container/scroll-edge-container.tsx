import {cloneElement, type ReactNode, useCallback, useMemo, useState} from 'react'
import {type LayoutChangeEvent, type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {ScrollEdgeContainerProps, ScrollEdgeEffect} from './scroll-edge-container.types'

type NativeScrollEdgeContainerProps = {
  bottomBarHeight: number
  children: ReactNode
  effect: ScrollEdgeEffect
  style?: StyleProp<ViewStyle>
  testID?: string
  topBarHeight: number
}

const NativeScrollEdgeContainer = requireKaraView<NativeScrollEdgeContainerProps>('ScrollEdgeContainerView')

const styles = StyleSheet.create({
  bottomBar: {bottom: 0, left: 0, position: 'absolute', right: 0},
  topBar: {left: 0, position: 'absolute', right: 0, top: 0},
})

/**
 * Wraps one React Native scroll view and gives its bars the iOS 26 scroll edge effect — the system's progressive blur
 * under content scrolling past them. Below iOS 26 the bars are still laid out, just without the effect, so check
 * `isScrollEdgeEffectAvailable()` and draw a fallback there.
 */
export const ScrollEdgeContainer = ({
  automaticInsets = true,
  bottomBar,
  children,
  effect = 'soft',
  style,
  testID,
  topBar,
}: ScrollEdgeContainerProps) => {
  const [topBarHeight, setTopBarHeight] = useState(0)
  const [bottomBarHeight, setBottomBarHeight] = useState(0)

  const onTopBarLayout = useCallback((event: LayoutChangeEvent) => {
    setTopBarHeight(event.nativeEvent.layout.height)
  }, [])

  const onBottomBarLayout = useCallback((event: LayoutChangeEvent) => {
    setBottomBarHeight(event.nativeEvent.layout.height)
  }, [])

  const {contentInset, scrollIndicatorInsets} = children.props

  const scrollable = useMemo(() => {
    if (!automaticInsets) {
      return children
    }

    const insets = {
      bottom: bottomBarHeight + (contentInset?.bottom ?? 0),
      left: contentInset?.left ?? 0,
      right: contentInset?.right ?? 0,
      top: topBarHeight + (contentInset?.top ?? 0),
    }

    const indicatorInsets = {
      bottom: bottomBarHeight + (scrollIndicatorInsets?.bottom ?? 0),
      left: scrollIndicatorInsets?.left ?? 0,
      right: scrollIndicatorInsets?.right ?? 0,
      top: topBarHeight + (scrollIndicatorInsets?.top ?? 0),
    }

    if (!topBar) {
      return cloneElement(children, {contentInset: insets, scrollIndicatorInsets: indicatorInsets})
    }

    return cloneElement(children, {
      contentInset: insets,
      contentOffset: {x: 0, y: -insets.top},
      scrollIndicatorInsets: indicatorInsets,
    })
  }, [automaticInsets, bottomBarHeight, children, contentInset, scrollIndicatorInsets, topBar, topBarHeight])

  return (
    <NativeScrollEdgeContainer
      bottomBarHeight={bottomBarHeight}
      effect={effect}
      style={style}
      testID={testID}
      topBarHeight={topBarHeight}
    >
      {scrollable}
      <View collapsable={false} onLayout={onTopBarLayout} style={styles.topBar}>
        {topBar}
      </View>
      <View collapsable={false} onLayout={onBottomBarLayout} style={styles.bottomBar}>
        {bottomBar}
      </View>
    </NativeScrollEdgeContainer>
  )
}
