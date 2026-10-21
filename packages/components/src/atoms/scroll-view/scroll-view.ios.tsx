import {HStack, ScrollView as SwiftUIScrollView, VStack} from '@expo/ui/swift-ui'
import {type ModifierConfig, refreshable} from '@expo/ui/swift-ui/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {ScrollViewComponent, ScrollViewProps} from './scroll-view.types'

export const ScrollView: ScrollViewComponent = ({
  axis = 'vertical',
  children,
  onRefresh,
  showsIndicators = true,
  spacing: gap,
  testID,
  ...sx
}: ScrollViewProps) => {
  useHostGuard('ScrollView')

  const modifiers = useSxModifiers(sx)
  const gapPoints = gap === undefined ? undefined : spacing[gap]

  // `refreshable` belongs on the scroll view itself, not on the stack inside it that `sx` styles.
  const scrollModifiers = useMemo<ModifierConfig[]>(
    () => (onRefresh && axis === 'vertical' ? [refreshable(onRefresh)] : []),
    [axis, onRefresh]
  )

  return (
    <SwiftUIScrollView axes={axis} modifiers={scrollModifiers} showsIndicators={showsIndicators} testID={testID}>
      {axis === 'horizontal' ? (
        <HStack modifiers={modifiers} spacing={gapPoints}>
          {children}
        </HStack>
      ) : (
        <VStack modifiers={modifiers} spacing={gapPoints}>
          {children}
        </VStack>
      )}
    </SwiftUIScrollView>
  )
}
