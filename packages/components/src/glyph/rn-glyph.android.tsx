import {GLYPHS} from '@hzblj/kara-native'
import {IconView} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {GlyphComponent, GlyphProps} from './glyph.types'

/** The Material Symbol drawable in an `ImageView` — the React Native tier. */
export const RnGlyph: GlyphComponent = ({color = 'content.primary', name, size = 's24'}: GlyphProps) => {
  const theme = useAppTheme()
  const style = useMemo(() => ({height: spacing[size], width: spacing[size]}), [size])

  return <IconView iconColor={theme.color(color)} resourceName={GLYPHS[name].android} style={style} />
}
