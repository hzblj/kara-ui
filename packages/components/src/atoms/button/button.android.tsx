import {Button as ComposeButton} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import type {ButtonComponent, ButtonProps} from './button.types'
import {buttonTokens} from './button-tokens'

export const Button: ButtonComponent = ({
  disabled = false,
  label,
  onPress,
  testID,
  variant = 'accent',
  wide = true,
}: ButtonProps) => {
  useHostGuard('Button')
  const theme = useAppTheme()
  const tokens = buttonTokens(variant, disabled, theme)
  const modifiers = useSxModifiers({borderRadius: 'medium', shadow: tokens.shadow, wide})

  return (
    <ComposeButton
      colors={{
        containerColor: theme.color(tokens.fill),
        contentColor: theme.color(tokens.content),
        disabledContainerColor: theme.color(tokens.fill),
        disabledContentColor: theme.color(tokens.content),
      }}
      enabled={!disabled}
      modifiers={modifiers}
      onClick={onPress}
    >
      {label}
    </ComposeButton>
  )
}
