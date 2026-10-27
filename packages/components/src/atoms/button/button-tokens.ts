import type {ColorToken, ShadowName, Theme} from '@hzblj/kara-theme'

import type {ButtonVariant} from './button.types'

/** `fill` and `shadow` are unset for `plain`: a text button has no container to fill or lift. */
type ButtonTokens = {
  content: ColorToken
  fill: ColorToken | undefined
  shadow: ShadowName | undefined
}

const TOKENS = {
  accent: {content: 'content.on.accent', fill: 'fill.accent.primary', shadow: 'btn.accent'},
  destructive: {content: 'content.on.destructive', fill: 'fill.destructive.primary', shadow: 'btn.destructive'},
  glass: {content: 'content.primary', fill: 'btn.bg.glass.base', shadow: 'btn.glass'},
  plain: {content: 'content.accent', fill: undefined, shadow: undefined},
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
    plain: undefined,
    secondary: 'btn.bg.secondary.disabled',
  } as const satisfies Record<ButtonVariant, ColorToken | undefined>

  void theme

  return {content: 'btn.content.disabled', fill: disabledFill[variant], shadow: tokens.shadow} as const
}

/** Relative luminance of a `#rrggbb` colour (any alpha ignored); `undefined` for anything else. */
const luminance = (color: unknown): number | undefined => {
  const hex = typeof color === 'string' ? /^#([0-9a-f]{6})/i.exec(color)?.[1] : undefined

  if (!hex) {
    return undefined
  }

  const [r, g, b] = [0, 2, 4].map(i => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255

    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * The hex behind a token in the current appearance. Android resolves an adaptive entry to one; iOS hands the platform
 * a dynamic colour instead, so there the authored entry is read and its branch picked. A system colour has none.
 */
const currentHex = (token: ColorToken, theme: Theme): unknown => {
  const resolved = theme.color(token)

  if (typeof resolved === 'string') {
    return resolved
  }

  const entry = token
    .split(':')[0]
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], theme)

  if (entry && typeof entry === 'object' && 'adaptive' in entry) {
    const {dark, light} = (entry as {adaptive: {dark: string; light: string}}).adaptive

    return theme.dark ? dark : light
  }

  return entry
}

/**
 * The label for a button filled with an arbitrary `tint`: the on-accent white over a strong colour, the primary
 * content colour over a pale one (`fill.accent.base`) — the light container tokens pair with it in both appearances.
 */
export const contentOnTint = (tint: ColorToken, theme: Theme): ColorToken =>
  (luminance(currentHex(tint, theme)) ?? 0) > 0.4 ? 'content.primary' : 'content.on.accent'
