import {duration, opacity} from '@hzblj/kara-theme'
import {useEffect} from 'react'
import {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated'

import {ABox} from '../box'
import type {SkeletonComponent, SkeletonProps} from './skeleton.types'

export const Skeleton: SkeletonComponent = ({borderRadius = 'small', h, testID, w}: SkeletonProps) => {
  const pulse = useSharedValue<number>(opacity.o40)

  useEffect(() => {
    pulse.value = withRepeat(withTiming(opacity.o100, {duration: duration.d800}), -1, true)
  }, [pulse])

  const rStyle = useAnimatedStyle(() => ({opacity: pulse.value}), [])

  return (
    <ABox
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
