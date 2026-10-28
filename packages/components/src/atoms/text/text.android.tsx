import {Text as ComposeText} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {AnimatedText, type AnimatedTextOverflow, type TextAnimation} from '@hzblj/kara-native/jetpack-compose'
import {
  animateConfig,
  type SxAnimateConfig,
  splitAccessibility,
  useAccessibilityModifiers,
  useSxModifiers,
} from '@hzblj/kara-sx'
import {duration, easing, springPhysics, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import {spansOf, textOf} from './spans'
import type {TextComponent, TextDecoration, TextProps, TextTransform, TextTruncation} from './text.types'

const DECORATION = {
  none: 'none',
  strikethrough: 'lineThrough',
  underline: 'underline',
} as const

const OVERFLOW = {
  head: 'startEllipsis',
  middle: 'middleEllipsis',
  tail: 'ellipsis',
} as const satisfies Record<TextTruncation, AnimatedTextOverflow>

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
  monospaced,
  monospacedDigit,
  numberOfLines,
  testID,
  transform,
  truncation = 'tail',
  variant = 'body',
  ...props
}: TextProps) => {
  useHostGuard('Text')
  const theme = useAppTheme()
  const style = (monospaced ? theme.monoTypography : theme.typography)[variant]
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx)
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...accessibilityModifiers],
    [accessibilityModifiers, sxModifiers, testID]
  )
  const spans = useMemo(() => spansOf(children, Text), [children])
  const animate = sx.animate === false ? undefined : sx.animate
  // Compose ellipsizes at the start or in the middle of a single line only, and clips a longer text: that ends at the
  // tail instead.
  const overflow = numberOfLines === 1 ? OVERFLOW[truncation] : 'ellipsis'

  // `@expo/ui`'s text takes spans but animates none, sets no font features and ellipsizes only at the end: with
  // `animate`, kara's own Compose text eases each span's colour, with `monospacedDigit` asks the face for its tabular
  // figures, and puts the ellipsis at the start or in the middle of a line.
  if (animate !== undefined || monospacedDigit || overflow !== 'ellipsis') {
    const runs = spans ?? [{text: textOf(children)}]

    return (
      <AnimatedText
        animation={animate === undefined ? undefined : textAnimation(animateConfig(animate))}
        fontFamily={style.fontFamily}
        fontFeatureSettings={monospacedDigit ? 'tnum' : undefined}
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
        textOverflow={overflow}
      />
    )
  }

  return (
    <ComposeText
      color={theme.colorString(color)}
      maxLines={numberOfLines}
      modifiers={modifiers}
      overflow="ellipsis"
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
