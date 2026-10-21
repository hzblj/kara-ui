import {useSplitSx} from '@hzblj/kara-sx'
import * as Haptics from 'expo-haptics'
import {useCallback} from 'react'
import {Pressable as RNPressable} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'
import type {PressableComponent, PressableProps} from './pressable.types'

const SPRING = {damping: 20, stiffness: 400}

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

export const Pressable: PressableComponent = ({
  children,
  disabled = false,
  haptic = false,
  onPress,
  testID,
  ...props
}: PressableProps) => {
  const [resolved, rest] = useSplitSx(props)
  const scale = useSharedValue(1)

  const rStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}), [])

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING)
  }, [scale])

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING)
  }, [scale])

  const onPressWithHaptic = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    }

    onPress?.()
  }, [haptic, onPress])

  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={8}
      onPress={onPressWithHaptic}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[resolved, rStyle]}
      testID={testID}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  )
}
