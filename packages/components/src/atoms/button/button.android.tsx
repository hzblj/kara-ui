import {Button as ComposeButton, Text as ComposeText, OutlinedButton} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {ButtonComponent, ButtonProps} from './button.types'
import {buttonTokens, contentOnTint} from './button-tokens'

/**
 * Material's filled button, in its own stadium shape. No `borderRadius` or `shadow` from the tokens: those shape the
 * SwiftUI button's glossy ring, and laid over a Compose button they clip and outline a rounded rectangle around the
 * pill Material draws. The label is a Compose `Text` — `@expo/ui`'s button takes composable content, not a string.
 *
 * Material has no glass, so `glass` is its outlined button — and a `tint` makes any variant a filled button in that
 * colour, as a prominent style does on iOS. `buttonStyle` and `controlSize` are SwiftUI's alone.
 */
export const Button: ButtonComponent = ({
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
  const sxModifiers = useSxModifiers({wide})
  const modifiers = useMemo(
    () => (testID ? [...sxModifiers, testIdModifier(testID)] : sxModifiers),
    [sxModifiers, testID]
  )
  const style = theme.typography.body
  const outlined = variant === 'glass' && !tint
  const fill = tint && !disabled ? tint : tokens.fill
  const content = tint && !disabled ? contentOnTint(tint, theme) : tokens.content
  const MaterialButton = outlined ? OutlinedButton : ComposeButton

  return (
    <MaterialButton
      colors={
        outlined
          ? {contentColor: theme.color(content), disabledContentColor: theme.color(content)}
          : {
              containerColor: theme.color(fill),
              contentColor: theme.color(content),
              disabledContainerColor: theme.color(fill),
              disabledContentColor: theme.color(content),
            }
      }
      enabled={!disabled}
      modifiers={modifiers}
      onClick={onPress}
    >
      <ComposeText
        color={theme.colorString(content)}
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
        }}
      >
        {label}
      </ComposeText>
    </MaterialButton>
  )
}
