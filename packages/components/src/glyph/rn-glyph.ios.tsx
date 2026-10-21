import {GLYPHS} from '@hzblj/kara-native'
import {IconView} from '@hzblj/kara-native/swift-ui'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {GlyphComponent, GlyphProps} from './glyph.types'

/** The SF Symbol in a `UIImageView`, drawn at the size `Glyph` gives it inside a host — the React Native tier. */
export const RnGlyph: GlyphComponent = ({color = 'content.primary', name, size = 's24'}: GlyphProps) => {
  const theme = useAppTheme()
  const style = useMemo(() => ({height: spacing[size], width: spacing[size]}), [size])

  return (
    <IconView iconColor={theme.color(color)} style={style} symbolSize={spacing[size]} systemName={GLYPHS[name].ios} />
  )
}
