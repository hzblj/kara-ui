import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {StyleSheet} from 'react-native'
import Animated, {useAnimatedStyle} from 'react-native-reanimated'

import {BlurView} from '../atoms/blur-view'
import type {HeroHeaderBackgroundComponent, HeroHeaderBackgroundProps} from './hero-header-background.types'

const styles = StyleSheet.create({
  bar: {left: 0, position: 'absolute', right: 0, top: 0},
})

/**
 * iOS 26 draws the bar's background itself: its scroll edge effect, switched on once the reveal starts. Before it the
 * bar's own blur cannot fade, so a material of the same kind fades in behind the transparent bar instead.
 */
export const HeroHeaderBackground: HeroHeaderBackgroundComponent = ({height, progress}: HeroHeaderBackgroundProps) => {
  const animatedStyle = useAnimatedStyle(() => ({opacity: progress.value}))

  if (isScrollEdgeEffectAvailable()) {
    return null
  }

  return (
    <Animated.View pointerEvents="none" style={[styles.bar, {height}, animatedStyle]}>
      <BlurView flex={1} material="thin" />
    </Animated.View>
  )
}
