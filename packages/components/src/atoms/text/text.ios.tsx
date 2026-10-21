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
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {TextComponent, TextProps} from './text.types'

const ALIGNMENT = {
  center: 'center',
  left: 'leading',
  right: 'trailing',
} as const

export const Text: TextComponent = ({
  align,
  children,
  color = 'content.primary',
  decoration,
  numberOfLines,
  testID,
  transform,
  variant = 'body',
}: TextProps) => {
  useHostGuard('Text')
  const theme = useAppTheme()
  const style = theme.typography[variant]

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

    return list
  }, [align, color, decoration, numberOfLines, style, theme, transform])

  return (
    <SwiftUIText modifiers={modifiers} testID={testID}>
      {children}
    </SwiftUIText>
  )
}
