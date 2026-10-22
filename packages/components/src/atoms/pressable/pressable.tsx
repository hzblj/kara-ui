import {useSplitSx} from '@hzblj/kara-sx'
import {useAppTheme, withOpacity} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'
import {Platform, Pressable as RNPressable, View, type ViewStyle} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'

import {haptics} from '../../haptics'
import {splitForRipple} from '../../ripple-clip'
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

  const theme = useAppTheme()
  const isAndroid = Platform.OS === 'android'

  const rStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}), [])

  // Android's press is Material's: a ripple over the content — the pressed state layer, `onSurface` at 10 % — clipped to
  // the shape by an outer view (`splitForRipple`), and nothing moves. iOS springs down.
  const ripple = useMemo(
    () =>
      isAndroid ? {color: withOpacity(String(theme.color('content.primary')), 'o10'), foreground: true} : undefined,
    [isAndroid, theme]
  )
  const androidStyle = useMemo(
    () => (isAndroid ? splitForRipple(resolved as ViewStyle) : undefined),
    [isAndroid, resolved]
  )

  // The finger is down: the Taptic Engine has until the release to wake, so the haptic lands with the press.
  const onPressIn = useCallback(() => {
    if (!isAndroid) {
      scale.value = withSpring(0.96, SPRING)
    }

    if (feedback) {
      haptics.prepare(feedback)
    }
  }, [feedback, isAndroid, scale])

  const onPressOut = useCallback(() => {
    if (!isAndroid) {
      scale.value = withSpring(1, SPRING)
    }
  }, [isAndroid, scale])

  const onPressWithHaptic = useCallback(() => {
    if (feedback) {
      haptics.play(feedback)
    }

    onPress?.()
  }, [feedback, onPress])

  if (androidStyle) {
    return (
      <View style={androidStyle.outer}>
        <RNPressable
          android_ripple={ripple}
          disabled={disabled}
          hitSlop={8}
          onPress={onPressWithHaptic}
          onPressIn={onPressIn}
          style={androidStyle.inner}
          testID={testID}
          {...rest}
        >
          {children}
        </RNPressable>
      </View>
    )
  }

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
