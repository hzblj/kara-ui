import {
  Button as ComposeButton,
  Spacer as ComposeSpacer,
  Text as ComposeText,
  OutlinedButton,
  TextButton,
} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier, width as widthModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import {Icon} from '../icon'
import type {ButtonComponent, ButtonProps} from './button.types'
import {buttonTokens, contentOnTint} from './button-tokens'

/** Material's `ButtonDefaults.IconSpacing`: the gap between a button's icon and its label. */
const ICON_GAP = [widthModifier(spacing.s8)]

/**
 * Material's padding for a button with a leading icon (`ButtonWithIconContentPadding`,
 * `TextButtonWithIconContentPadding`): the icon side a step tighter than the label's. Top and bottom keep the defaults.
 */
const WITH_ICON_PADDING = {end: spacing.s24, start: spacing.s16}
const TEXT_WITH_ICON_PADDING = {end: spacing.s16, start: spacing.s12}

/**
 * Material's filled button, in its own stadium shape. No `borderRadius` or `shadow` from the tokens: those shape the
 * SwiftUI button's glossy ring, and laid over a Compose button they clip and outline a rounded rectangle around the
 * pill Material draws. The label is a Compose `Text` — `@expo/ui`'s button takes composable content, not a string —
 * after the `icon`, when there is one, in the same row.
 *
 * Material has no glass, so `glass` is its outlined button — and a `tint` makes any variant but `plain` a filled
 * button in that colour, as a prominent style does on iOS. `plain` is Material's `TextButton`, and a `tint` colours its
 * label. `buttonStyle` and `controlSize` are SwiftUI's alone.
 */
export const Button: ButtonComponent = ({
  accessibilityHint,
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
  const sxModifiers = useSxModifiers({wide})
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityHint}, accessibilityHint !== undefined)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...accessibilityModifiers],
    [accessibilityModifiers, sxModifiers, testID]
  )
  const style = theme.typography.body
  const text = variant === 'plain'
  const outlined = variant === 'glass' && !tint
  const fill = tint && !disabled ? tint : tokens.fill
  const content = !tint || disabled ? tokens.content : text ? tint : contentOnTint(tint, theme)
  const MaterialButton = text ? TextButton : outlined ? OutlinedButton : ComposeButton

  return (
    <MaterialButton
      colors={
        fill && !text && !outlined
          ? {
              containerColor: theme.color(fill),
              contentColor: theme.color(content),
              disabledContainerColor: theme.color(fill),
              disabledContentColor: theme.color(content),
            }
          : {contentColor: theme.color(content), disabledContentColor: theme.color(content)}
      }
      contentPadding={icon ? (text ? TEXT_WITH_ICON_PADDING : WITH_ICON_PADDING) : undefined}
      enabled={!disabled}
      modifiers={modifiers}
      onClick={onPress}
    >
      {icon ? <Icon color={content} name={icon} size="s20" /> : null}
      {icon ? <ComposeSpacer modifiers={ICON_GAP} /> : null}
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
