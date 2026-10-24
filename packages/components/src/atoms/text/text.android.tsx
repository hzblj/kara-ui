import {Text as ComposeText} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {AnimatedText, type TextAnimation} from '@hzblj/kara-native/jetpack-compose'
import {
  animateConfig,
  type SxAnimateConfig,
  splitAccessibility,
  useAccessibilityModifiers,
  useSxModifiers,
} from '@hzblj/kara-sx'
import {duration, easing, springPhysics, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import {spansOf} from './spans'
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

const transformed = (text: string, transform: TextTransform | undefined) =>
  transform === 'uppercase' ? text.toUpperCase() : transform === 'lowercase' ? text.toLowerCase() : text

/**
 * `animate` for the spans' colours, as `@hzblj/kara-sx` animates the rest on Compose: a spring token's physics, and
 * `smoothOut` as a no-bounce spring over its duration; the other curves as tweens along their béziers.
 */
const textAnimation = (config: SxAnimateConfig): TextAnimation => {
  if (config.spring) {
    const {dampingRatio, stiffness} = springPhysics(config.spring)

    return {dampingRatio, stiffness, type: 'spring'}
  }

  const milliseconds = duration[config.duration ?? 'fast']
  const curve = config.easing ?? 'smoothOut'

  if (curve === 'smoothOut') {
    const omega = (2 * Math.PI * 1000) / milliseconds

    return {dampingRatio: 1, stiffness: omega * omega, type: 'spring'}
  }

  return {delayMillis: config.delay, durationMillis: milliseconds, easing: easing[curve], type: 'tween'}
}

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
  const spans = useMemo(() => spansOf(children, Text), [children])
  const animate = sx.animate

  // `@expo/ui`'s text takes spans but animates none: with `animate`, kara's own Compose text eases each span's colour.
  if (animate !== undefined && animate !== false) {
    const runs = spans ?? [{text: typeof children === 'string' || typeof children === 'number' ? String(children) : ''}]

    return (
      <AnimatedText
        animation={textAnimation(animateConfig(animate))}
        fontFamily={style.fontFamily}
        fontSize={style.fontSize}
        fontWeight={style.fontWeight}
        lineHeight={style.lineHeight}
        maxLines={numberOfLines}
        modifiers={modifiers}
        spans={runs.map(span => ({
          color: span.color ? theme.colorString(span.color) : undefined,
          text: transformed(span.text, transform),
        }))}
        textAlign={align}
        textColor={theme.colorString(color)}
        textDecoration={decorationOf(decoration)}
      />
    )
  }

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
      {spans
        ? spans.map((span, index) => (
            <ComposeText color={span.color ? theme.colorString(span.color) : undefined} key={index}>
              {transformed(span.text, transform)}
            </ComposeText>
          ))
        : applyTransform(children, transform)}
    </ComposeText>
  )
}
