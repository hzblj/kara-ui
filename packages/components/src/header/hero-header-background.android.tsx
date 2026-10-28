import {useAppTheme} from '@hzblj/kara-theme'
import {StyleSheet} from 'react-native'
import Animated, {useAnimatedStyle} from 'react-native-reanimated'

import type {HeroHeaderBackgroundComponent, HeroHeaderBackgroundProps} from './hero-header-background.types'

const styles = StyleSheet.create({
  bar: {left: 0, position: 'absolute', right: 0, top: 0},
})

/** The top app bar's surface, fading in behind the transparent bar as the hero scrolls away. */
export const HeroHeaderBackground: HeroHeaderBackgroundComponent = ({height, progress}: HeroHeaderBackgroundProps) => {
  const theme = useAppTheme()
  const animatedStyle = useAnimatedStyle(() => ({opacity: progress.value}))

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.bar, {backgroundColor: theme.color('surface.base'), height}, animatedStyle]}
    />
  )
}
