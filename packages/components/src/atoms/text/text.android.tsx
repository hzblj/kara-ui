import {Text as ComposeText} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {TextComponent, TextDecoration, TextProps, TextTransform} from './text.types'

const DECORATION = {
  none: 'none',
  strikethrough: 'lineThrough',
  underline: 'underline',
} as const

const applyTransform = (children: TextProps['children'], transform: TextTransform | undefined) => {
  if (!transform || typeof children !== 'string') {
    return children
  }

  return transform === 'uppercase' ? children.toUpperCase() : children.toLowerCase()
}

const decorationOf = (decoration: TextDecoration | undefined) =>
  decoration === undefined ? undefined : DECORATION[decoration]

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
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx)
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...accessibilityModifiers],
    [accessibilityModifiers, sxModifiers, testID]
  )

  return (
    <ComposeText
      color={theme.colorString(color)}
      maxLines={numberOfLines}
      modifiers={modifiers}
      style={{
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        textAlign: align,
        textDecoration: decorationOf(decoration),
      }}
    >
      {applyTransform(children, transform)}
    </ComposeText>
  )
}
