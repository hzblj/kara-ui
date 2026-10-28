import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {StyleSheet, View} from 'react-native'

import {BlurView} from '../../atoms/blur-view'
import type {HeroHeaderBackgroundComponent, HeroHeaderBackgroundProps} from './hero-header-background.types'

const styles = StyleSheet.create({
  bar: {left: 0, position: 'absolute', right: 0, top: 0},
})

/**
 * iOS 26 draws the bar's background itself: its scroll edge effect, switched on once the reveal starts. Before it the
 * bar's own blur cannot fade, so the bar's chrome material comes in behind the transparent bar by its intensity, the
 * way UIKit fades a material in, rather than by its opacity.
 */
export const HeroHeaderBackground: HeroHeaderBackgroundComponent = ({height, progress}: HeroHeaderBackgroundProps) => {
  if (isScrollEdgeEffectAvailable()) {
    return null
  }

  return (
    <View pointerEvents="none" style={[styles.bar, {height}]}>
      <BlurView flex={1} intensity={progress} material="ultraThick" />
    </View>
  )
}
