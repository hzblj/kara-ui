import {Box} from '../../atoms/box'
import type {ScrollEdgeContainerComponent, ScrollEdgeContainerProps} from './scroll-edge-container.types'

/**
 * Android has no scroll edge effect, and a React Native scroll view there has no `contentInset` to slide content under
 * a bar with — so the bars stack above and below the scroll view instead of over it. Give them a background.
 */
export const ScrollEdgeContainer: ScrollEdgeContainerComponent = ({
  automaticInsets: _automaticInsets,
  bottomBar,
  children,
  effect: _effect,
  testID,
  topBar,
  ...sx
}: ScrollEdgeContainerProps) => (
  <Box {...sx} testID={testID}>
    {topBar}
    <Box flex={1}>{children}</Box>
    {bottomBar}
  </Box>
)
