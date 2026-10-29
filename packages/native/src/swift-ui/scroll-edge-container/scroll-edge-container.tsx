import {cloneElement, type Key, type ReactNode, useCallback, useMemo, useState} from 'react'
import {type LayoutChangeEvent, type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {ScrollEdgeContainerProps, ScrollEdgeEffect} from './scroll-edge-container.types'

type NativeScrollEdgeContainerProps = {
  bottomBarHeight: number
  children: ReactNode
  effect: ScrollEdgeEffect
  isContentScrollView: boolean
  isTopEdgeEffectHidden: boolean
  scrollableKey: string
  style?: StyleProp<ViewStyle>
  testID?: string
  topBarHeight: number
}

type NativeScrollEdgeTopBarProps = {
  children?: ReactNode
  pointerEvents: 'box-none'
  scrollInsetExtra?: number
}

const NativeScrollEdgeContainer = requireKaraView<NativeScrollEdgeContainerProps>('ScrollEdgeContainerView')
const NativeScrollEdgeTopBar = requireKaraView<NativeScrollEdgeTopBarProps>('ScrollEdgeTopBarView')

/**
 * Both bars sit at `top: 0` in the React layout: SwiftUI places them, React only measures their height. A bottom bar
 * laid out at `bottom: 0` got its Yoga frame re-applied inside SwiftUI's host container on every layout pass, so during
 * a keyboard animation it jumped between the two positions and its buttons missed taps.
 */
const styles = StyleSheet.create({
  bar: {left: 0, position: 'absolute', right: 0, top: 0},
  scrollable: {flex: 1},
})

const INSET_NUDGE_STEPS = 1000
const INSET_NUDGE_UNIT = 0.0001

let scrollableMountCount = 0

/**
 * A top inset a few ten-thousandths of a point off for every new scroll child. React Native 0.86's `prepareForRecycle`
 * zeroes a recycled `UIScrollView`'s `contentInset` but keeps the old props, so a scroll view remounted with the same
 * inset (a filter change remounting a list by `key`) never got it back and started under the top bar. Fixed upstream in
 * facebook/react-native#57494; drop the nudge once a release carries it.
 */
const nextInsetNudge = (_scrollableKey: Key | null) => {
  scrollableMountCount = (scrollableMountCount + 1) % INSET_NUDGE_STEPS

  return scrollableMountCount * INSET_NUDGE_UNIT
}

/**
 * Wraps one React Native scroll view and gives its bars the iOS 26 scroll edge effect — the system's progressive blur
 * under content scrolling past them. Below iOS 26 the bars are still laid out, just without the effect, so check
 * `isScrollEdgeEffectAvailable()` and draw a fallback there.
 *
 * The scroll view sits in a stable `View` that never remounts, and its `key` goes to native as `scrollableKey`: Expo's
 * SwiftUI host adds a React view to its container only when SwiftUI first makes it, so a scroll view remounted by `key`
 * came back as the same recycled view into a container the unmount had emptied, and the screen went blank.
 */
export const ScrollEdgeContainer = ({
  automaticInsets = true,
  bottomBar,
  children,
  contentScrollView = false,
  effect = 'soft',
  initialBottomBarHeight = 0,
  initialTopBarHeight = 0,
  style,
  testID,
  topBar,
  topEdgeEffectHidden = false,
}: ScrollEdgeContainerProps) => {
  const [topBarHeight, setTopBarHeight] = useState(initialTopBarHeight)
  const [bottomBarHeight, setBottomBarHeight] = useState(initialBottomBarHeight)

  const onTopBarLayout = useCallback((event: LayoutChangeEvent) => {
    setTopBarHeight(event.nativeEvent.layout.height)
  }, [])

  const onBottomBarLayout = useCallback((event: LayoutChangeEvent) => {
    setBottomBarHeight(event.nativeEvent.layout.height)
  }, [])

  const {contentInset, scrollIndicatorInsets} = children.props
  const scrollableKey = children.key
  const insetNudge = useMemo(() => nextInsetNudge(scrollableKey), [scrollableKey])
  const scrollInsetExtra = automaticInsets ? (contentInset?.top ?? 0) + insetNudge : undefined

  const scrollable = useMemo(() => {
    if (!automaticInsets) {
      return children
    }

    const insets = {
      bottom: bottomBarHeight + (contentInset?.bottom ?? 0),
      left: contentInset?.left ?? 0,
      right: contentInset?.right ?? 0,
      top: topBarHeight + (contentInset?.top ?? 0) + insetNudge,
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
  }, [
    automaticInsets,
    bottomBarHeight,
    children,
    contentInset,
    insetNudge,
    scrollIndicatorInsets,
    topBar,
    topBarHeight,
  ])

  return (
    <NativeScrollEdgeContainer
      bottomBarHeight={bottomBarHeight}
      effect={effect}
      isContentScrollView={contentScrollView}
      isTopEdgeEffectHidden={topEdgeEffectHidden}
      scrollableKey={scrollableKey === null ? '' : String(scrollableKey)}
      style={style}
      testID={testID}
      topBarHeight={topBarHeight}
    >
      <View collapsable={false} style={styles.scrollable}>
        {scrollable}
      </View>
      <View collapsable={false} onLayout={onTopBarLayout} pointerEvents="box-none" style={styles.bar}>
        <NativeScrollEdgeTopBar pointerEvents="box-none" scrollInsetExtra={scrollInsetExtra}>
          {topBar}
        </NativeScrollEdgeTopBar>
      </View>
      <View collapsable={false} onLayout={onBottomBarLayout} pointerEvents="box-none" style={styles.bar}>
        {bottomBar}
      </View>
    </NativeScrollEdgeContainer>
  )
}
