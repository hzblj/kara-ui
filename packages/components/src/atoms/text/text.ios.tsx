import {Text as SwiftUIText} from '@expo/ui/swift-ui'
import {
  foregroundStyle,
  lineLimit,
  lineSpacing,
  type ModifierConfig,
  multilineTextAlignment,
  strikethrough,
  textCase,
  underline,
} from '@expo/ui/swift-ui/modifiers'
import {scaledFont} from '@hzblj/kara-native/swift-ui'
import {type FrameAlignment, splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {TextAlign, TextComponent, TextProps} from './text.types'

const ALIGNMENT = {
  center: 'center',
  left: 'leading',
  right: 'trailing',
} as const

/** Where a frame larger than the text — `wide`, `w`, `h` — puts it: on the side its lines align to, centred vertically. */
const FRAME_ALIGNMENT = {
  center: 'center',
  left: 'leading',
  right: 'trailing',
} as const satisfies Record<TextAlign, FrameAlignment>

export const Text: TextComponent = ({
  align,
  children,
  color = 'content.primary',
  decoration,
  numberOfLines,
  testID,
  transform,
  variant = 'body',
  ...props
}: TextProps) => {
  useHostGuard('Text')
  const theme = useAppTheme()
  const style = theme.typography[variant]
  // After the text's own modifiers: the font and colour belong to the glyphs, the padding and frame to the box around.
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx, FRAME_ALIGNMENT[align ?? 'left'])
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)

  const modifiers = useMemo(() => {
    const list: ModifierConfig[] = [
      // Not `@expo/ui`'s `font()`: for the platform's face it gives either Apple's size or a size that ignores Dynamic
      // Type. `scaledFont` keeps the variant's exact size and scales it along `scalesWith`, either face.
      scaledFont({family: style.fontFamily, size: style.fontSize, textStyle: style.scalesWith, weight: style.weight}),
      lineSpacing(Math.max(0, style.lineHeight - style.fontSize)),
      foregroundStyle(theme.color(color)),
    ]

    if (align) {
      list.push(multilineTextAlignment(ALIGNMENT[align]))
    }

    if (transform) {
      list.push(textCase(transform))
    }

    if (decoration === 'underline') {
      list.push(underline({isActive: true, pattern: 'solid'}))
    }

    if (decoration === 'strikethrough') {
      list.push(strikethrough({isActive: true, pattern: 'solid'}))
    }

    if (numberOfLines !== undefined) {
      list.push(lineLimit(numberOfLines))
    }

    return [...list, ...sxModifiers, ...accessibilityModifiers]
  }, [accessibilityModifiers, align, color, decoration, numberOfLines, style, sxModifiers, theme, transform])

  return (
    <SwiftUIText modifiers={modifiers} testID={testID}>
      {children}
    </SwiftUIText>
  )
}
