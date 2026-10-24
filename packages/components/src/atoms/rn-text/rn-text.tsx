import {
  isAnimatedStyle,
  markMotionComponent,
  type SxMotion,
  themeKey,
  useAnimatedLatch,
  useSplitSxMotion,
} from '@hzblj/kara-sx'
import {
  type ColorToken,
  MAX_FONT_SCALE,
  type TextVariant,
  type Theme,
  useAppTheme,
  useFontScale,
} from '@hzblj/kara-theme'
import {Platform, Text as RNText, type StyleProp, type TextStyle} from 'react-native'
import Animated from 'react-native-reanimated'

import type {RnTextComponent, RnTextProps} from './rn-text.types'

/**
 * A hundredth of a point off every line on iOS, which no one can see and which keeps the last line on screen. React
 * Native measures a paragraph and rounds the height up to the pixel grid, then draws it into the frame Yoga laid out,
 * and that frame can come back a hair short of the exact height (`53.9998` for three 18 pt lines, depending on where
 * the text sits on the page). With `lineHeight` fixed, the lines need exactly 54 and the text container drops the last
 * one, cutting the line before it off mid-word. Lines a hair shorter leave the rounding room to absorb the error.
 */
const LINE_HEIGHT_SLACK = Platform.OS === 'ios' ? 0.01 : 0

/** Variants, colours and alignments are few, so the text half of the style is shared like the `sx` half. */
const MAX_TEXT_STYLES = 512

const textStyles = new Map<string, TextStyle>()

/** Digits of one width: React Native asks the face for its tabular figures. */
const TABULAR_NUMS: TextStyle['fontVariant'] = ['tabular-nums']

/** What the text half of the style is built from. */
type TextLook = Pick<RnTextProps, 'align' | 'monospaced' | 'monospacedDigit'> & {
  color: ColorToken
  variant: TextVariant
}

/**
 * The variant at the user's text size, in its colour. React Native scales `fontSize` for the user's setting but leaves
 * `lineHeight` alone, so a grown glyph ends up in an ungrown line and clips. Scaling it here by the same factor keeps
 * the ratio the variant was designed at, and by the same ceiling `maxFontSizeMultiplier` caps the glyph with
 * (`useFontScale` is capped already), so the two cannot disagree.
 *
 * The native tiers need none of this: SwiftUI's `lineSpacing` is extra space *on top of* the font's own line
 * height, which scales with it, and Compose reads `lineHeight` in `sp`.
 */
const textStyle = (
  theme: Theme,
  fontScale: number,
  {align, color, monospaced = false, monospacedDigit = false, variant}: TextLook
): TextStyle => {
  const key = `${themeKey(theme)}|${variant}|${color}|${align}|${fontScale}|${monospaced}|${monospacedDigit}`
  const existing = textStyles.get(key)

  if (existing) {
    return existing
  }

  if (textStyles.size >= MAX_TEXT_STYLES) {
    textStyles.clear()
  }

  const typography = (monospaced ? theme.monoTypography : theme.typography)[variant]
  const style: TextStyle = {
    ...typography,
    color: theme.color(color),
    lineHeight: typography.lineHeight * fontScale - LINE_HEIGHT_SLACK,
  }

  if (align) {
    style.textAlign = align
  }

  if (monospacedDigit) {
    style.fontVariant = TABULAR_NUMS
  }

  textStyles.set(key, style)

  return style
}

export const RnText: RnTextComponent = markMotionComponent(
  ({align, color = 'content.primary', monospaced, monospacedDigit, style, variant = 'body', ...props}: RnTextProps) => {
    const theme = useAppTheme()
    const fontScale = useFontScale()
    // A view style, which a text accepts whole — only React Native's types disagree, on `userSelect`'s width.
    const [sx, motion, rest] = useSplitSxMotion(props) as [TextStyle, SxMotion, Record<string, unknown>]
    const animated = useAnimatedLatch(motion.animated || isAnimatedStyle(style), 'RnText')
    const text = textStyle(theme, fontScale, {align, color, monospaced, monospacedDigit, variant})

    if (!animated) {
      return (
        <RNText maxFontSizeMultiplier={MAX_FONT_SCALE} style={[text, sx, style as StyleProp<TextStyle>]} {...rest} />
      )
    }

    return (
      <Animated.Text
        entering={motion.entering}
        exiting={motion.exiting}
        layout={motion.layout}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[text, sx, motion.style, style]}
        {...rest}
      />
    )
  }
)
