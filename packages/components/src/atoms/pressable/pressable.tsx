import {haptics} from '@hzblj/expo-rich-haptics'
import {
  type AnimatableKey,
  accessibilityProps,
  markMotionComponent,
  type SxAnimate,
  splitAccessibility,
  spring,
  timing,
  useSplitSxMotion,
} from '@hzblj/kara-sx'
import {opacity, type SpringName, springs, useAppTheme, useReducedMotion, withOpacity} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'
import {Platform, Pressable as RNPressable, type ViewStyle} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated'

import {splitForRipple} from '../../ripple-clip'
import type {PressableComponent, PressableProps} from './pressable.types'

/**
 * The scale follows the finger on springs, as UIKit's own presses do: down on `interactive`, back on `smooth`, neither
 * with a bounce (a press is not a toy). A spring keeps the speed it has, so a tap let go halfway down eases back instead
 * of turning on the spot, which a timed curve restarted from rest cannot do.
 */
const SCALE_IN = spring('interactive')
const SCALE_OUT = spring('smooth')

/** A dim comes in at once and leaves a little slower, as UIKit's own highlight does. */
const DIM_IN = timing('micro', 'out')
const DIM_OUT = timing('quick', 'out')

const PLATFORM_EFFECT = Platform.OS === 'ios' ? 'scale' : 'none'

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

/** What `animate` covers by default, less the transform. */
const VISUAL_KEYS: readonly AnimatableKey[] = ['bg', 'borderColor', 'opacity']

const TRANSFORM_KEYS = new Set<AnimatableKey>(['offsetX', 'offsetY', 'rotate', 'scale'])

/**
 * The press scale owns the transform, so `animate` leaves it alone: a transition on the same transform would take it
 * back from the press at every re-render. A duration or spring token keeps its timing.
 */
const withoutTransform = (animate: SxAnimate | undefined): SxAnimate | undefined => {
  if (animate === undefined || animate === false) {
    return animate
  }

  if (animate === true) {
    return {keys: VISUAL_KEYS}
  }

  if (typeof animate === 'string') {
    return animate in springs
      ? {keys: VISUAL_KEYS, spring: animate as SpringName}
      : {duration: animate as Exclude<typeof animate, SpringName>, keys: VISUAL_KEYS}
  }

  return {...animate, keys: (animate.keys ?? VISUAL_KEYS).filter(key => !TRANSFORM_KEYS.has(key))}
}

export const Pressable: PressableComponent = markMotionComponent(
  ({
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
    const reduced = useReducedMotion()
    // With motion reduced the press still shows, and nothing moves: a scale dims instead.
    const effect = reduced && pressEffect === 'scale' ? 'opacity' : pressEffect
    // Always a Reanimated view (the press effect is one), so the motion props need no latch here.
    const [resolved, motion, rest] = useSplitSxMotion(
      effect === 'scale' && ownProps.animate !== undefined
        ? {...ownProps, animate: withoutTransform(ownProps.animate as SxAnimate)}
        : ownProps
    )
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
      if (effect === 'scale') {
        pressed.value = withSpring(1, SCALE_IN)
      } else if (effect === 'opacity') {
        pressed.value = withTiming(1, DIM_IN)
      }

      if (feedback) {
        haptics.prepare(feedback)
      }
    }, [effect, feedback, pressed])

    const onPressOut = useCallback(() => {
      pressed.value = effect === 'scale' ? withSpring(0, SCALE_OUT) : withTiming(0, DIM_OUT)
    }, [effect, pressed])

    const onPressWithHaptic = useCallback(() => {
      if (feedback) {
        haptics.play(feedback)
      }

      onPress?.()
    }, [feedback, onPress])

    if (androidStyle) {
      return (
        <Animated.View
          entering={motion.entering}
          exiting={motion.exiting}
          layout={motion.layout}
          style={[androidStyle.outer, motion.style, rStyle]}
        >
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
        entering={motion.entering}
        exiting={motion.exiting}
        hitSlop={8}
        layout={motion.layout}
        onPress={onPressWithHaptic}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[resolved, motion.style, rStyle]}
        testID={testID}
        {...rest}
      >
        {children}
      </AnimatedPressable>
    )
  }
)
