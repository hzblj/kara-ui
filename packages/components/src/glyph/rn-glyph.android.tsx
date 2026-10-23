import {NativeIconView} from '@hzblj/expo-native-icons'
import {GLYPHS} from '@hzblj/kara-native'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {GlyphComponent, GlyphProps} from './glyph.types'

/**
 * The Material Symbol drawable, drawn by `@hzblj/expo-native-icons`' `NativeIconView` (any drawable by name, not only
 * the app's icons): the React Native tier.
 */
export const RnGlyph: GlyphComponent = ({color = 'content.primary', name, size = 's24'}: GlyphProps) => {
  const theme = useAppTheme()
  const style = useMemo(() => ({height: spacing[size], width: spacing[size]}), [size])

  return (
    <NativeIconView
      accessibilityElementsHidden
      iconColor={theme.color(color)}
      importantForAccessibility="no-hide-descendants"
      resourceName={GLYPHS[name].android}
      style={style}
    />
  )
}
