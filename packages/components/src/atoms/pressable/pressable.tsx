import {useSplitSx} from '@hzblj/kara-sx'
import {duration, opacity, useAppTheme, withOpacity} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'
import {Platform, Pressable as RNPressable, type ViewStyle} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated'

import {haptics} from '../../haptics'
import {splitForRipple} from '../../ripple-clip'
import type {PressableComponent, PressableProps} from './pressable.types'

const SPRING = {damping: 20, stiffness: 400}

/** A dim comes in quickly and leaves a little slower, as UIKit's own highlight does. */
const DIM_IN = {duration: duration.d100}
const DIM_OUT = {duration: duration.d200}

const PLATFORM_EFFECT = Platform.OS === 'ios' ? 'scale' : 'none'

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

export const Pressable: PressableComponent = ({
  children,
  disabled = false,
  haptic = false,
  onPress,
  pressEffect = PLATFORM_EFFECT,
  pressedOpacity = 'o60',
  pressedScale = 0.96,
  ripple: withRipple = true,
  testID,
  ...props
}: PressableProps) => {
  const [resolved, rest] = useSplitSx(props)
  // 0 at rest, 1 held: one value drives whichever effect is picked, so a change of effect needs no second animation.
  const pressed = useSharedValue(0)
  const feedback = haptic === true ? 'light' : haptic || undefined
  const dimmed = opacity[pressedOpacity]

  const theme = useAppTheme()
  const isAndroid = Platform.OS === 'android'

  const rStyle = useAnimatedStyle(() => {
    if (pressEffect === 'scale') {
      return {transform: [{scale: 1 - (1 - pressedScale) * pressed.value}]}
    }

    return pressEffect === 'opacity' ? {opacity: 1 - (1 - dimmed) * pressed.value} : {}
  }, [dimmed, pressEffect, pressedScale])

  // Android's press is Material's: a ripple over the content (the pressed state layer, `onSurface` at 10 %) clipped to
  // the shape by an outer view (`splitForRipple`). The effect, when there is one, moves that outer view, ripple and all.
  const ripple = useMemo(
    () =>
      isAndroid && withRipple
        ? {color: withOpacity(String(theme.color('content.primary')), 'o10'), foreground: true}
        : undefined,
    [isAndroid, theme, withRipple]
  )
  const androidStyle = useMemo(
    () => (isAndroid ? splitForRipple(resolved as ViewStyle) : undefined),
    [isAndroid, resolved]
  )

  // The finger is down: the Taptic Engine has until the release to wake, so the haptic lands with the press.
  const onPressIn = useCallback(() => {
    if (pressEffect === 'scale') {
      pressed.value = withSpring(1, SPRING)
    } else if (pressEffect === 'opacity') {
      pressed.value = withTiming(1, DIM_IN)
    }

    if (feedback) {
      haptics.prepare(feedback)
    }
  }, [feedback, pressEffect, pressed])

  const onPressOut = useCallback(() => {
    pressed.value = pressEffect === 'scale' ? withSpring(0, SPRING) : withTiming(0, DIM_OUT)
  }, [pressEffect, pressed])

  const onPressWithHaptic = useCallback(() => {
    if (feedback) {
      haptics.play(feedback)
    }

    onPress?.()
  }, [feedback, onPress])

  if (androidStyle) {
    return (
      <Animated.View style={[androidStyle.outer, rStyle]}>
        <RNPressable
          android_ripple={ripple}
          disabled={disabled}
          hitSlop={8}
          onPress={onPressWithHaptic}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={androidStyle.inner}
          testID={testID}
          {...rest}
        >
          {children}
        </RNPressable>
      </Animated.View>
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
