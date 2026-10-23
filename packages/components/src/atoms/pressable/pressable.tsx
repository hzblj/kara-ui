import {accessibilityProps, splitAccessibility, useSplitSx} from '@hzblj/kara-sx'
import {opacity, useAppTheme, useReducedMotion, withOpacity} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'
import {Platform, Pressable as RNPressable, type ViewStyle} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import {haptics} from '../../haptics'
import {timing} from '../../motion'
import {splitForRipple} from '../../ripple-clip'
import type {PressableComponent, PressableProps} from './pressable.types'

/** The scale eases down and settles back a little slower, with no bounce: a press is not a toy. */
const SCALE_IN = timing('quick')
const SCALE_OUT = timing('fast')

/** A dim comes in at once and leaves a little slower, as UIKit's own highlight does. */
const DIM_IN = timing('micro', 'out')
const DIM_OUT = timing('quick', 'out')

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
  const [accessibility, ownProps] = splitAccessibility(props)
  const [resolved, rest] = useSplitSx(ownProps)
  const reduced = useReducedMotion()
  // With motion reduced the press still shows, and nothing moves: a scale dims instead.
  const effect = reduced && pressEffect === 'scale' ? 'opacity' : pressEffect
  // 0 at rest, 1 held: one value drives whichever effect is picked, so a change of effect needs no second animation.
  const pressed = useSharedValue(0)
  const feedback = haptic === true ? 'light' : haptic || undefined
  const a11y = accessibilityProps(accessibility, 'button')
  const dimmed = opacity[pressedOpacity]

  const theme = useAppTheme()
  const isAndroid = Platform.OS === 'android'

  const rStyle = useAnimatedStyle(() => {
    if (effect === 'scale') {
      return {transform: [{scale: 1 - (1 - pressedScale) * pressed.value}]}
    }

    return effect === 'opacity' ? {opacity: 1 - (1 - dimmed) * pressed.value} : {}
  }, [dimmed, effect, pressedScale])

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
    if (effect !== 'none') {
      pressed.value = withTiming(1, effect === 'scale' ? SCALE_IN : DIM_IN)
    }

    if (feedback) {
      haptics.prepare(feedback)
    }
  }, [effect, feedback, pressed])

  const onPressOut = useCallback(() => {
    pressed.value = withTiming(0, effect === 'scale' ? SCALE_OUT : DIM_OUT)
  }, [effect, pressed])

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
          {...a11y}
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
      {...a11y}
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
