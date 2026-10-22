import {BlurView as NativeBlurView} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {StyleSheet} from 'react-native'

import type {BlurViewComponent, BlurViewProps} from './blur-view.types'

/** `borderRadius` is the material's shape, so it goes to the effect view — the one that clips — not the layout box. */
export const BlurView: BlurViewComponent = ({
  appearance,
  children,
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

  return (
    <NativeBlurView
      colorScheme={appearance ?? (theme.dark ? 'dark' : 'light')}
      cornerRadius={cornerRadius}
      material={material}
      style={style}
      testID={testID}
      vibrancy={vibrancy}
    >
      {children}
    </NativeBlurView>
  )
}
