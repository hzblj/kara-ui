import {Button as SwiftUIButton, Label as SwiftUILabel} from '@expo/ui/swift-ui'
import {
  buttonStyle as buttonStyleModifier,
  contentShape,
  controlSize as controlSizeModifier,
  disabled as disabledModifier,
  glassEffect as glassEffectModifier,
  labelStyle,
  shapes,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {type ColorToken, type Theme, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import {Icon} from '../icon'
import {Text} from '../text'
import {VStack} from '../v-stack'
import type {ButtonComponent, ButtonProps, ButtonStyleName, ButtonVariant} from './button.types'
import {buttonTokens, contentOnTint} from './button-tokens'

const STYLE_BY_VARIANT = {
  accent: 'borderedProminent',
  destructive: 'borderedProminent',
  glass: 'glass',
  plain: 'borderless',
  secondary: 'bordered',
} as const satisfies Record<ButtonVariant, ButtonStyleName>

const TINT_BY_VARIANT = {
  accent: 'fill.accent.primary',
  destructive: 'fill.destructive.primary',
  glass: undefined,
  plain: undefined,
  secondary: undefined,
} as const satisfies Record<ButtonVariant, ColorToken | undefined>

/** Both, wherever the button sits: a toolbar or a menu would otherwise show the icon alone. */
const TITLE_AND_ICON = [labelStyle('titleAndIcon')]

/**
 * `borderless` draws nothing around the label, so the label is the button: padding takes it to a 44pt tap target,
 * and a rectangle content shape makes the whole of it (the padding, and the width `wide` gives it) take the tap,
 * not only the glyphs.
 */
const TEXT_BUTTON_TARGET = {modifiers: [contentShape(shapes.rectangle())]}

/**
 * A prominent style (and tinted glass) is coloured by the tint, so a caller's own tint picks the label on it. A text
 * style has nothing to fill, so there the tint is the label's own colour.
 */
const labelColor = ({
  disabled,
  filled,
  textOnly,
  theme,
  tint,
  tokens,
}: {
  disabled: boolean
  filled: boolean
  textOnly: boolean
  theme: Theme
  tint: ColorToken | undefined
  tokens: {content: ColorToken}
}): ColorToken => {
  if (!tint || disabled) {
    return tokens.content
  }

  if (filled) {
    return contentOnTint(tint, theme)
  }

  return textOnly ? tint : tokens.content
}

export const Button: ButtonComponent = ({
  accessibilityHint,
  buttonStyle,
  controlSize = 'large',
  disabled = false,
  icon,
  label,
  onPress,
  testID,
  tint,
  variant = 'accent',
  wide = true,
}: ButtonProps) => {
  useHostGuard('Button')
  const theme = useAppTheme()
  const tokens = buttonTokens(variant, disabled, theme)
  const resolvedTint = tint ?? TINT_BY_VARIANT[variant]
  const style = buttonStyle ?? STYLE_BY_VARIANT[variant]

  /**
   * `.glass` ignores `.tint` — colouring the material is `.glassEffect(.regular.tint(…))`, a different
   * modifier that only lands on a button once the style stops drawing its own material. So a tinted
   * glass button is a plain one wearing the effect, and `interactive` is what buys back the press
   * response the style would have given it.
   *
   * `plain` has no chrome for `controlSize` to size, so the label carries the padding that gives the
   * button its height — without it a tinted glass button comes out shorter than every other variant.
   */
  const glassTint = style === 'glass' && resolvedTint ? theme.color(resolvedTint) : undefined
  const filled = Boolean(glassTint) || style === 'borderedProminent' || style === 'glassProminent'
  const textOnly = style === 'borderless' || style === 'plain'
  // Only the `plain` variant's own text button is padded out; another variant restyled `plain` keeps its layout.
  const textButton = variant === 'plain' && textOnly
  const content = labelColor({disabled, filled, textOnly, theme, tint, tokens})

  const accessibilityModifiers = useAccessibilityModifiers({accessibilityHint})

  const modifiers = useMemo(() => {
    const list = [
      buttonStyleModifier(glassTint ? 'plain' : style),
      controlSizeModifier(controlSize),
      ...accessibilityModifiers,
    ]

    if (glassTint) {
      list.push(
        glassEffectModifier({glass: {interactive: true, tint: glassTint, variant: 'regular'}, shape: 'capsule'})
      )
    } else if (resolvedTint) {
      list.push(tintModifier(theme.color(resolvedTint)))
    }

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [accessibilityModifiers, controlSize, disabled, glassTint, resolvedTint, style, theme])

  const text = (
    <Text color={content} variant="body">
      {label}
    </Text>
  )

  return (
    <SwiftUIButton modifiers={modifiers} onPress={onPress} testID={testID}>
      <VStack
        align="center"
        ios={textButton ? TEXT_BUTTON_TARGET : undefined}
        py={glassTint ? 's16' : textButton ? 's12' : undefined}
        wide={wide}
      >
        {icon ? (
          <SwiftUILabel icon={<Icon color={content} name={icon} size="s20" />} modifiers={TITLE_AND_ICON}>
            {text}
          </SwiftUILabel>
        ) : (
          text
        )}
      </VStack>
    </SwiftUIButton>
  )
}
