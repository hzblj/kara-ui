import {ScrollEdgeContainer as NativeScrollEdgeContainer} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import type {ScrollEdgeContainerComponent, ScrollEdgeContainerProps} from './scroll-edge-container.types'

/**
 * Below iOS 26 the native container still lays the bars out as insets, just without the effect — so a bar wants a
 * background of its own there; `isScrollEdgeEffectAvailable()` says which case applies.
 */
export const ScrollEdgeContainer: ScrollEdgeContainerComponent = ({
  automaticInsets,
  bottomBar,
  children,
  contentScrollView,
  effect,
  initialBottomBarHeight,
  initialTopBarHeight,
  testID,
  topBar,
  topEdgeEffectHidden,
  ...sx
}: ScrollEdgeContainerProps) => {
  const style = useSx(sx)

  return (
    <NativeScrollEdgeContainer
      automaticInsets={automaticInsets}
      bottomBar={bottomBar}
      contentScrollView={contentScrollView}
      effect={effect}
      initialBottomBarHeight={initialBottomBarHeight}
      initialTopBarHeight={initialTopBarHeight}
      style={style}
      testID={testID}
      topBar={topBar}
      topEdgeEffectHidden={topEdgeEffectHidden}
    >
      {children}
    </NativeScrollEdgeContainer>
  )
}
