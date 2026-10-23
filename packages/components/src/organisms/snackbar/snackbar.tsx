import {duration as durations, easing, spacing, useReducedMotion} from '@hzblj/kara-theme'
import {useEffect, useRef} from 'react'
import {AccessibilityInfo, Platform} from 'react-native'
import {
  Easing,
  type EntryExitAnimationFunction,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  ReduceMotion,
  withTiming,
} from 'react-native-reanimated'

import {ABox, Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import {RnGlyph} from '../../glyph'
import {timing} from '../../motion'
import type {SnackbarAnimation, SnackbarComponent, SnackbarDuration, SnackbarProps} from './snackbar.types'

/** Material's `SnackbarDuration.Short` and `Long`. */
const DURATIONS = {long: 10_000, short: 4_000} as const

const PLATFORM_ANIMATION: SnackbarAnimation = Platform.OS === 'android' ? 'scale' : 'slide'

/** The close glyph at the label's height: an SF Symbol fills its box, Material's icon sits inside a padded one. */
const CLOSE_SIZE = Platform.OS === 'ios' ? 's12' : 's16'

const SMOOTH_OUT = Easing.bezier(...easing.smoothOut)
const GROW = timing('quick')

/** Material's snackbar enter: it fades in while it grows from 80 %, in 150 ms. */
const scaleIn: EntryExitAnimationFunction = () => {
  'worklet'

  return {
    animations: {opacity: withTiming(1, GROW), transform: [{scale: withTiming(1, GROW)}]},
    initialValues: {opacity: 0, transform: [{scale: 0.8}]},
  }
}

/**
 * The presets in and out: arriving in `fast`, leaving in `quick`, both on `smoothOut`. `ReduceMotion.Never`, because
 * `useReducedMotion` has already picked the fade by then, and a fade is what should still run.
 */
const TRANSITIONS = {
  fade: {
    entering: FadeIn.duration(durations.fast).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
    exiting: FadeOut.duration(durations.quick).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
  },
  // Material's exit is a 75 ms fade: `micro`.
  scale: {entering: scaleIn, exiting: FadeOut.duration(durations.micro).reduceMotion(ReduceMotion.Never)},
  // Slide: in from the edge it sits on, and back out toward it.
  slideBottom: {
    entering: FadeInDown.duration(durations.fast).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
    exiting: FadeOutDown.duration(durations.quick).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
  },
  slideTop: {
    entering: FadeInUp.duration(durations.fast).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
    exiting: FadeOutUp.duration(durations.quick).easing(SMOOTH_OUT).reduceMotion(ReduceMotion.Never),
  },
}

const transitionsFor = (animation: SnackbarAnimation, position: 'bottom' | 'top') => {
  if (animation === 'slide') {
    return position === 'top' ? TRANSITIONS.slideTop : TRANSITIONS.slideBottom
  }

  return TRANSITIONS[animation]
}

const millisecondsOf = (duration: SnackbarDuration) =>
  typeof duration === 'number' ? duration : duration === 'indefinite' ? undefined : DURATIONS[duration]

export const Snackbar: SnackbarComponent = ({
  actionLabel,
  actionOnNewLine = false,
  animation = PLATFORM_ANIMATION,
  dismissible = false,
  duration = 'indefinite',
  entering,
  exiting,
  message,
  offset = 's24',
  onAction,
  onDismiss,
  position = 'bottom',
  visible,
}: SnackbarProps) => {
  const reduced = useReducedMotion()
  // A caller's inline `onDismiss` is a new function every render; the timer must not restart for it.
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new `message` restarts the timer, as a new snackbar
  useEffect(() => {
    const milliseconds = millisecondsOf(duration)

    if (!visible || milliseconds === undefined) {
      return
    }

    const timer = setTimeout(() => dismiss.current?.(), milliseconds)

    return () => clearTimeout(timer)
  }, [duration, message, visible])

  // Material's snackbar is announced; a React Native view is not unless asked.
  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility(message)
    }
  }, [message, visible])

  if (!visible) {
    return null
  }

  const edge = position === 'top' ? {top: spacing[offset]} : {bottom: spacing[offset]}
  const hasTrailing = Boolean(actionLabel) || dismissible
  // With motion reduced it only fades: nothing slides or grows.
  const preset = transitionsFor(reduced ? 'fade' : animation, position)

  return (
    <ABox
      align={actionOnNewLine ? 'stretch' : 'center'}
      bg="surface.high.contrast"
      borderRadius="medium"
      flexDirection={actionOnNewLine ? 'column' : 'row'}
      gap={actionOnNewLine ? 's8' : 's12'}
      left={spacing.s16}
      position="absolute"
      px="s16"
      py="s12"
      right={spacing.s16}
      shadow="snackbar"
      {...edge}
      entering={entering ?? preset.entering}
      exiting={exiting ?? preset.exiting}
    >
      {/* It takes the room, so the action sits at the trailing end, as far in from it as the message is from the start. */}
      <RnText color="content.on.high.contrast" flex={actionOnNewLine ? undefined : 1} variant="footnote">
        {message}
      </RnText>
      {hasTrailing ? (
        <Box align="center" alignSelf={actionOnNewLine ? 'flex-end' : undefined} flexDirection="row" gap="s16">
          {actionLabel ? (
            <Pressable onPress={onAction} pressEffect="opacity" ripple={false}>
              <RnText color="content.accent" variant="footnoteMedium">
                {actionLabel}
              </RnText>
            </Pressable>
          ) : null}
          {dismissible ? (
            <Pressable accessibilityLabel="Dismiss" onPress={onDismiss} pressEffect="opacity" ripple={false}>
              <RnGlyph color="content.on.high.contrast" name="close" size={CLOSE_SIZE} />
            </Pressable>
          ) : null}
        </Box>
      ) : null}
    </ABox>
  )
}
