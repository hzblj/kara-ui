import {Button as SwiftUIButton} from '@expo/ui/swift-ui'
import {
  buttonStyle as buttonStyleModifier,
  controlSize as controlSizeModifier,
  disabled as disabledModifier,
  glassEffect as glassEffectModifier,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers'
import {type ColorToken, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {Text} from '../text'
import {VStack} from '../v-stack'
import type {ButtonComponent, ButtonProps, ButtonStyleName, ButtonVariant} from './button.types'
import {buttonTokens} from './button-tokens'

const STYLE_BY_VARIANT = {
  accent: 'borderedProminent',
  destructive: 'borderedProminent',
  glass: 'glass',
  secondary: 'bordered',
} as const satisfies Record<ButtonVariant, ButtonStyleName>

const TINT_BY_VARIANT = {
  accent: 'fill.accent.primary',
  destructive: 'fill.destructive.primary',
  glass: undefined,
  secondary: undefined,
} as const satisfies Record<ButtonVariant, ColorToken | undefined>

export const Button: ButtonComponent = ({
  buttonStyle,
  controlSize = 'large',
  disabled = false,
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

  const modifiers = useMemo(() => {
    const list = [buttonStyleModifier(glassTint ? 'plain' : style), controlSizeModifier(controlSize)]

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
  }, [controlSize, disabled, glassTint, resolvedTint, style, theme])

  return (
    <SwiftUIButton modifiers={modifiers} onPress={onPress} testID={testID}>
      <VStack align="center" py={glassTint ? 's16' : undefined} wide={wide}>
        <Text color={tokens.content} variant="body">
          {label}
        </Text>
      </VStack>
    </SwiftUIButton>
  )
}
