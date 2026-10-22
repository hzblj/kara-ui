import {useSplitSx} from '@hzblj/kara-sx'
import {MAX_FONT_SCALE, useAppTheme} from '@hzblj/kara-theme'
import {Text as RNText, type TextStyle, useWindowDimensions} from 'react-native'

import type {RnTextComponent, RnTextProps} from './rn-text.types'

export const RnText: RnTextComponent = ({
  align,
  color = 'content.primary',
  variant = 'body',
  ...props
}: RnTextProps) => {
  const theme = useAppTheme()
  // A view style, which a text accepts whole — only React Native's types disagree, on `userSelect`'s width.
  const [sx, rest] = useSplitSx(props) as [TextStyle, Record<string, unknown>]
  const {fontScale} = useWindowDimensions()
  const style = theme.typography[variant]

  /**
   * React Native scales `fontSize` for the user's setting but leaves `lineHeight` alone, so a grown glyph ends up in
   * an ungrown line and clips. Scaling it here by the same factor keeps the ratio the variant was designed at — and
   * by the same ceiling `maxFontSizeMultiplier` caps the glyph with, so the two cannot disagree.
   *
   * The native tiers need none of this: SwiftUI's `lineSpacing` is extra space *on top of* the font's own line
   * height, which scales with it, and Compose reads `lineHeight` in `sp`.
   */
  const lineHeight = style.lineHeight * Math.min(fontScale, MAX_FONT_SCALE)

  return (
    <RNText
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[style, sx, {color: theme.color(color), lineHeight, textAlign: align}]}
      {...rest}
    />
  )
}
