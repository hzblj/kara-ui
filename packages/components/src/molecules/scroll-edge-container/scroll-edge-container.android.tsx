import {opacity} from '@hzblj/kara-theme'
import {cloneElement, type ReactNode, useCallback, useRef} from 'react'
import type {LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent} from 'react-native'
import {type SharedValue, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import {ABox, Box} from '../../atoms/box'
import {timing} from '../../motion'
import type {ScrollEdgeContainerComponent, ScrollEdgeContainerProps} from './scroll-edge-container.types'

/** Less than a pixel scrolled is not scrolled — a fling settles a fraction away from the edge. */
const EDGE_SLOP = 0.5

const FILL = timing('quick', 'out')

type Bar = {children: ReactNode; filled: SharedValue<number>}

/** A bar, and behind it the container colour it fills with — faded in and out, not switched. */
const EdgeBar = ({children, filled}: Bar) => {
  const fill = useAnimatedStyle(() => ({opacity: filled.value}), [])

  if (!children) {
    return null
  }

  return (
    <Box>
      <ABox
        bg="surface.secondary"
        bottom={0}
        left={0}
        pointerEvents="none"
        position="absolute"
        right={0}
        style={fill}
        top={0}
      />
      {children}
    </Box>
  )
}

/**
 * Material's take on the scroll edge: a React Native scroll view has no `contentInset` to slide content under a bar on
 * Android, so the bars stack above and below it, and do what a Material top app bar does on scroll — transparent at
 * rest, filled with `surface.secondary` (the scrolled container colour, `surfaceContainer`) once content has scrolled
 * under it. The bottom bar mirrors it: filled while there is more content below. The scroll view keeps its own
 * `onScroll`, `onLayout` and `onContentSizeChange`.
 */
export const ScrollEdgeContainer: ScrollEdgeContainerComponent = ({
  automaticInsets: _automaticInsets,
  bottomBar,
  children,
  effect: _effect,
  testID,
  topBar,
  ...sx
}: ScrollEdgeContainerProps) => {
  const topFilled = useSharedValue<number>(opacity.o0)
  const bottomFilled = useSharedValue<number>(opacity.o0)
  const metrics = useRef({content: 0, offset: 0, viewport: 0})
  const state = useRef({bottom: false, top: false})
  const {flex, onContentSizeChange, onLayout, onScroll, scrollEventThrottle} = children.props as {
    flex?: number
    onContentSizeChange?: (width: number, height: number) => void
    onLayout?: (event: LayoutChangeEvent) => void
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
    scrollEventThrottle?: number
  }

  // Only a change of state animates; a scroll event restating the same one would restart the fade.
  const update = useCallback(() => {
    const {content, offset, viewport} = metrics.current
    const top = offset > EDGE_SLOP
    const bottom = viewport > 0 && offset + viewport < content - EDGE_SLOP

    if (top !== state.current.top) {
      state.current.top = top
      topFilled.value = withTiming(top ? opacity.o100 : opacity.o0, FILL)
    }

    if (bottom !== state.current.bottom) {
      state.current.bottom = bottom
      bottomFilled.value = withTiming(bottom ? opacity.o100 : opacity.o0, FILL)
    }
  }, [bottomFilled, topFilled])

  // `flex` so the scroll view takes the room between the bars — left to its content, it grew to the content's height,
  // ran under the bottom bar and had nothing to scroll.
  const scrollable = cloneElement(children, {
    flex: flex ?? 1,
    onContentSizeChange: (width: number, height: number) => {
      metrics.current.content = height
      update()
      onContentSizeChange?.(width, height)
    },
    onLayout: (event: LayoutChangeEvent) => {
      metrics.current.viewport = event.nativeEvent.layout.height
      update()
      onLayout?.(event)
    },
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      metrics.current.offset = event.nativeEvent.contentOffset.y
      update()
      onScroll?.(event)
    },
    scrollEventThrottle: scrollEventThrottle ?? 16,
  } as Partial<typeof children.props>)

  return (
    <Box {...sx} testID={testID}>
      <EdgeBar filled={topFilled}>{topBar}</EdgeBar>
      <Box flex={1}>{scrollable}</Box>
      <EdgeBar filled={bottomFilled}>{bottomBar}</EdgeBar>
    </Box>
  )
}
