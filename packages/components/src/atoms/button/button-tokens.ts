import type {ColorToken, ShadowName, Theme} from '@hzblj/kara-theme'

import type {ButtonVariant} from './button.types'

type ButtonTokens = {
  content: ColorToken
  fill: ColorToken
  shadow: ShadowName
}

const TOKENS = {
  accent: {content: 'content.on.bg', fill: 'fill.accent.primary', shadow: 'btn.accent'},
  destructive: {content: 'content.on.destructive', fill: 'fill.destructive.primary', shadow: 'btn.destructive'},
  glass: {content: 'content.primary', fill: 'btn.bg.glass.base', shadow: 'btn.glass'},
  secondary: {content: 'content.primary', fill: 'btn.bg.secondary.base', shadow: 'btn.secondary'},
} as const satisfies Record<ButtonVariant, ButtonTokens>

export const buttonTokens = (variant: ButtonVariant, disabled: boolean, theme: Theme) => {
  const tokens = TOKENS[variant]

  if (!disabled) {
    return tokens
  }

  const disabledFill = {
    accent: 'fill.accent.disabled',
    destructive: 'fill.destructive.disabled',
    glass: 'btn.bg.glass.disabled',
    secondary: 'btn.bg.secondary.disabled',
  } as const satisfies Record<ButtonVariant, ColorToken>

  void theme

  return {content: 'btn.content.disabled', fill: disabledFill[variant], shadow: tokens.shadow} as const
}
