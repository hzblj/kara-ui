import {useSplitSx} from '@hzblj/kara-sx'
import {useCallback} from 'react'
import {Pressable as RNPressable} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'

import {haptics} from '../../haptics'
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
  const feedback = haptic === true ? 'light' : haptic || undefined

  const rStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}), [])

  // The finger is down: the Taptic Engine has until the release to wake, so the haptic lands with the press.
  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING)

    if (feedback) {
      haptics.prepare(feedback)
    }
  }, [feedback, scale])

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING)
  }, [scale])

  const onPressWithHaptic = useCallback(() => {
    if (feedback) {
      haptics.play(feedback)
    }

    onPress?.()
  }, [feedback, onPress])

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
