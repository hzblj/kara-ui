import {timing} from '@hzblj/kara-sx'
import {duration, opacity, useReducedMotion} from '@hzblj/kara-theme'
import {useEffect} from 'react'
import {cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated'

import {Box} from '../box'
import type {SkeletonComponent, SkeletonProps} from './skeleton.types'

/** A breath, not a transition, so it sits off the scale: `slow` twice each way, at constant speed. */
const PULSE = {...timing('slow', 'linear'), duration: duration.slow * 2}

export const Skeleton: SkeletonComponent = ({borderRadius = 'small', h, testID, w}: SkeletonProps) => {
  const reduced = useReducedMotion()
  const pulse = useSharedValue<number>(opacity.o40)

  // With motion reduced it holds still, halfway between the two ends of the pulse.
  useEffect(() => {
    if (reduced) {
      cancelAnimation(pulse)
      pulse.value = opacity.o70
      return
    }

    pulse.value = opacity.o40
    pulse.value = withRepeat(withTiming(opacity.o100, PULSE), -1, true)
  }, [pulse, reduced])

  const rStyle = useAnimatedStyle(() => ({opacity: pulse.value}), [])

  return (
    <Box
      aria-hidden
      bg="fill.quaternary"
      borderRadius={borderRadius}
      h={h}
      style={rStyle}
      testID={testID}
      w={w}
      wide={w === undefined}
    />
  )
}
