import {BackdropBlurView} from '@hzblj/kara-native/jetpack-compose'
import {useSx} from '@hzblj/kara-sx'
import {type ColorToken, type OpacitySize, useAppTheme, withOpacity} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {StyleSheet} from 'react-native'

import type {BlurMaterial, BlurViewComponent, BlurViewProps} from './blur-view.types'

type MaterialSpec = {
  /** dp. */
  blur: number
  /** A Material tonal surface — the thicker the material, the higher the container. */
  fill: ColorToken
  /**
   * How much of the surface covers the blur, light and dark. A dark material covers more, as iOS's do: a dark surface
   * over a bright backdrop otherwise leaves light content on light colour.
   */
  opacity: {dark: OpacitySize; light: OpacitySize}
  /** iOS's materials lift the colour of what they blur; a plain blur greys it into mud. */
  saturation: number
}

const MATERIALS: Record<BlurMaterial, MaterialSpec> = {
  regular: {blur: 28, fill: 'surface.secondary', opacity: {dark: 'o75', light: 'o60'}, saturation: 1.6},
  thick: {blur: 30, fill: 'surface.secondary', opacity: {dark: 'o85', light: 'o80'}, saturation: 1.4},
  thin: {blur: 24, fill: 'surface.primary', opacity: {dark: 'o60', light: 'o40'}, saturation: 1.7},
  ultraThick: {blur: 32, fill: 'fill.quaternary', opacity: {dark: 'o90', light: 'o90'}, saturation: 1.2},
  ultraThin: {blur: 20, fill: 'surface.base', opacity: {dark: 'o50', light: 'o25'}, saturation: 1.8},
}

/**
 * The materials in Android's terms: kara's `BackdropBlurView` — what lies behind, blurred and saturated — under a
 * Material tonal surface that gets higher and more opaque as the material thickens. Pinned to the appearance the app
 * is not in, the surface is Material's inverse one. `vibrancy` has no Android counterpart and is left out.
 */
export const BlurView: BlurViewComponent = ({
  appearance,
  children,
  material = 'regular',
  testID,
  vibrancy: _vibrancy,
  ...sx
}: BlurViewProps) => {
  const theme = useAppTheme()
  const resolved = useSx(sx)
  const spec = MATERIALS[material]
  const inverted = appearance !== undefined && (appearance === 'dark') !== theme.dark
  const dark = appearance ? appearance === 'dark' : theme.dark
  const base = String(theme.color(inverted ? 'surface.high.contrast' : spec.fill))
  const {cornerRadius, style} = useMemo(() => {
    const {borderRadius, ...rest} = StyleSheet.flatten(resolved) ?? {}
    return {cornerRadius: typeof borderRadius === 'number' ? borderRadius : 0, style: rest}
  }, [resolved])

  return (
    <BackdropBlurView
      blurRadius={spec.blur}
      cornerRadius={cornerRadius}
      fallbackTint={withOpacity(base, 'o95')}
      glassTint={withOpacity(base, spec.opacity[dark ? 'dark' : 'light'])}
      saturation={spec.saturation}
      style={style}
      testID={testID}
    >
      {children}
    </BackdropBlurView>
  )
}
