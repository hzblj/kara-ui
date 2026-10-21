import {Image} from '@expo/ui/swift-ui'
import {accessibilityHidden} from '@expo/ui/swift-ui/modifiers'
import {GLYPHS} from '@hzblj/kara-native'
import {spacing, useAppTheme} from '@hzblj/kara-theme'

import type {GlyphComponent, GlyphProps} from './glyph.types'

const DECORATIVE = [accessibilityHidden(true)]

/** The SF Symbol the system already has — inside a SwiftUI host. */
export const Glyph: GlyphComponent = ({color = 'content.primary', name, size = 's24'}: GlyphProps) => {
  const theme = useAppTheme()

  return <Image color={theme.color(color)} modifiers={DECORATIVE} size={spacing[size]} systemName={GLYPHS[name].ios} />
}
