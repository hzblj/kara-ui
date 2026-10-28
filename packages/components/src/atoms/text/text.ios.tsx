import {Text as SwiftUIText} from '@expo/ui/swift-ui'
import {
  foregroundStyle,
  lineLimit,
  lineSpacing,
  type ModifierConfig,
  monospacedDigit as monospacedDigitModifier,
  multilineTextAlignment,
  strikethrough,
  textCase,
  truncationMode,
  underline,
} from '@expo/ui/swift-ui/modifiers'
import {scaledFont} from '@hzblj/kara-native/swift-ui'
import {
  type FrameAlignment,
  splitAccessibility,
  textColorTransition,
  useAccessibilityModifiers,
  useSxModifiers,
} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import {spansKey, spansOf} from './spans'
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
  monospaced,
  monospacedDigit,
  numberOfLines,
  testID,
  transform,
  truncation,
  variant = 'body',
  ...props
}: TextProps) => {
  useHostGuard('Text')
  const theme = useAppTheme()
  const style = (monospaced ? theme.monoTypography : theme.typography)[variant]
  // After the text's own modifiers: the font and colour belong to the glyphs, the padding and frame to the box around.
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx, FRAME_ALIGNMENT[align ?? 'left'])
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const spans = useMemo(() => spansOf(children, Text), [children])
  const animate = sx.animate
  // With `animate`, SwiftUI interpolates the text when a colour changes: the text's own or a span's.
  const transition = useMemo(
    () => textColorTransition(animate, spansKey(color, spans, typeof children === 'string' ? children : '')),
    [animate, children, color, spans]
  )

  const modifiers = useMemo(() => {
    const list: ModifierConfig[] = [
      // Not `@expo/ui`'s `font()`: for the platform's face it gives either Apple's size or a size that ignores Dynamic
      // Type. `scaledFont` keeps the variant's exact size and scales it along `scalesWith`, either face.
      scaledFont({family: style.fontFamily, size: style.fontSize, textStyle: style.scalesWith, weight: style.weight}),
      lineSpacing(Math.max(0, style.lineHeight - style.fontSize)),
      foregroundStyle(theme.color(color)),
    ]

    if (monospacedDigit) {
      list.push(monospacedDigitModifier())
    }

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

    if (truncation) {
      list.push(truncationMode(truncation))
    }

    return [...list, ...transition, ...sxModifiers, ...accessibilityModifiers]
  }, [
    accessibilityModifiers,
    align,
    color,
    decoration,
    monospacedDigit,
    numberOfLines,
    style,
    sxModifiers,
    theme,
    transform,
    transition,
    truncation,
  ])

  return (
    <SwiftUIText modifiers={modifiers} testID={testID}>
      {spans
        ? spans.map((span, index) => (
            // Concatenated into one SwiftUI `Text`: a span takes its colour, the font and the rest are the outer text's.
            <SwiftUIText key={index} modifiers={span.color ? [foregroundStyle(theme.color(span.color))] : undefined}>
              {span.text}
            </SwiftUIText>
          ))
        : children}
    </SwiftUIText>
  )
}
