import {
  IconButton as ComposeIconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {type ColorToken, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import {buttonTokens, contentOnTint} from '../button/button-tokens'
import {Icon} from '../icon'
import type {IconButtonComponent, IconButtonProps, IconButtonVariant} from './icon-button.types'

/** Material has no glass: `glass` is the tonal button, a contained one that still reads over a photo or a map. */
const MATERIAL_BY_VARIANT = {
  filled: FilledIconButton,
  glass: FilledTonalIconButton,
  outlined: OutlinedIconButton,
  plain: ComposeIconButton,
  tonal: FilledTonalIconButton,
} as const satisfies Record<IconButtonVariant, unknown>

/** Which `Button` variant's tokens fill the container: the same accent and secondary fills a `Button` draws. */
const FILL_BY_VARIANT = {
  filled: 'accent',
  glass: 'secondary',
  outlined: undefined,
  plain: undefined,
  tonal: 'secondary',
} as const satisfies Record<IconButtonVariant, 'accent' | 'secondary' | undefined>

export const IconButton: IconButtonComponent = ({
  accessibilityHint,
  accessibilityLabel,
  color,
  disabled = false,
  name,
  onPress,
  testID,
  variant = 'plain',
}: IconButtonProps) => {
  useHostGuard('IconButton')
  const theme = useAppTheme()
  // The label rides on the icon, as Material's own icon buttons carry it; the hint labels the click.
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityHint}, accessibilityHint !== undefined)
  const modifiers = useMemo(
    () => (testID ? [testIdModifier(testID), ...accessibilityModifiers] : accessibilityModifiers),
    [accessibilityModifiers, testID]
  )
  const MaterialIconButton = MATERIAL_BY_VARIANT[variant]
  const fillVariant = FILL_BY_VARIANT[variant]
  const tokens = fillVariant ? buttonTokens(fillVariant, disabled, theme) : undefined

  // `filled` takes the colour as its fill and picks the icon's on it, as a tinted `Button` does; the rest colour the icon.
  const filled = variant === 'filled'
  const fill = filled && color && !disabled ? color : tokens?.fill
  let iconColor: ColorToken = color ?? 'content.primary'

  if (disabled) {
    iconColor = 'btn.content.disabled'
  } else if (filled) {
    iconColor = color ? contentOnTint(color, theme) : 'content.on.accent'
  }

  return (
    <MaterialIconButton
      colors={fill ? {containerColor: theme.color(fill), disabledContainerColor: theme.color(fill)} : undefined}
      enabled={!disabled}
      modifiers={modifiers}
      onClick={onPress}
    >
      <Icon accessibilityLabel={accessibilityLabel} color={iconColor} name={name} />
    </MaterialIconButton>
  )
}
