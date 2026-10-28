import {BlurView as NativeBlurView} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {isSharedValue, useAnimatedProps} from 'react-native-reanimated'

import type {BlurViewComponent, BlurViewProps} from './blur-view.types'

const AnimatedNativeBlurView = Animated.createAnimatedComponent(NativeBlurView)

/** `borderRadius` is the material's shape, so it goes to the effect view — the one that clips — not the layout box. */
export const BlurView: BlurViewComponent = ({
  appearance,
  children,
  intensity = 1,
  material = 'regular',
  testID,
  vibrancy,
  ...sx
}: BlurViewProps) => {
  const theme = useAppTheme()
  const resolved = useSx(sx)
  const {cornerRadius, style} = useMemo(() => {
    const {borderRadius, ...rest} = StyleSheet.flatten(resolved) ?? {}
    return {cornerRadius: typeof borderRadius === 'number' ? borderRadius : 0, style: rest}
  }, [resolved])

  const animatedProps = useAnimatedProps(() => ({
    intensity: isSharedValue<number>(intensity) ? intensity.value : intensity,
  }))

  if (isSharedValue<number>(intensity)) {
    return (
      <AnimatedNativeBlurView
        animatedProps={animatedProps}
        colorScheme={appearance ?? (theme.dark ? 'dark' : 'light')}
        cornerRadius={cornerRadius}
        material={material}
        style={style}
        testID={testID}
        vibrancy={vibrancy}
      >
        {children}
      </AnimatedNativeBlurView>
    )
  }

  return (
    <NativeBlurView
      colorScheme={appearance ?? (theme.dark ? 'dark' : 'light')}
      cornerRadius={cornerRadius}
      intensity={intensity}
      material={material}
      style={style}
      testID={testID}
      vibrancy={vibrancy}
    >
      {children}
    </NativeBlurView>
  )
}
