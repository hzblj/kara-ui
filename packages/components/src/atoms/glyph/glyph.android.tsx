import {GLYPHS} from '@hzblj/kara-native'
import {DrawableIcon} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'

import type {GlyphComponent, GlyphProps} from './glyph.types'

/** The Material Symbol `@hzblj/kara-native` ships as a drawable — inside a Compose host. */
export const Glyph: GlyphComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  name,
  size = 's24',
}: GlyphProps) => {
  const theme = useAppTheme()

  return (
    <DrawableIcon
      accessibilityLabel={accessibilityLabel}
      iconColor={theme.color(color)}
      iconSize={spacing[size]}
      resourceName={GLYPHS[name].android}
    />
  )
}
