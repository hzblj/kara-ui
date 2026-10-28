import {Image} from '@expo/ui/swift-ui'
import {accessibilityHidden, accessibilityLabel as labelModifier} from '@expo/ui/swift-ui/modifiers'
import {GLYPHS} from '@hzblj/kara-native'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {GlyphComponent, GlyphProps} from './glyph.types'

const DECORATIVE = [accessibilityHidden(true)]

/** The SF Symbol the system already has — inside a SwiftUI host. */
export const Glyph: GlyphComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  name,
  size = 's24',
}: GlyphProps) => {
  const theme = useAppTheme()
  const modifiers = useMemo(
    () => (accessibilityLabel ? [labelModifier(accessibilityLabel)] : DECORATIVE),
    [accessibilityLabel]
  )

  return <Image color={theme.color(color)} modifiers={modifiers} size={spacing[size]} systemName={GLYPHS[name].ios} />
}
