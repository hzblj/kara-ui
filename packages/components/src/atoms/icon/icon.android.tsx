import {iconResourceName, nativeIconEffectRecord, nativeIconTriggerKey} from '@hzblj/expo-native-icons'
import {DrawableIcon} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {IconComponent, IconProps} from './icon.types'

/**
 * The app's icon as the vector drawable the config plugin generated from the SVG, drawn by Material's `Icon`; with an
 * effect, a transition, a rendering mode, a variable value or a gradient, by `@hzblj/expo-native-icons`' view, which
 * plays them.
 */
export const Icon: IconComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  effect,
  effectActive,
  effectTrigger,
  gradient,
  name,
  renderingMode,
  secondaryColor,
  size = 's24',
  tertiaryColor,
  transition,
  variableValue,
}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()
  const effectKey = effect ? JSON.stringify(effect) : undefined
  const record = useMemo(() => (effectKey ? nativeIconEffectRecord(JSON.parse(effectKey)) : undefined), [effectKey])

  return (
    <DrawableIcon
      accessibilityLabel={accessibilityLabel}
      effect={record}
      effectActive={effectActive}
      effectTrigger={nativeIconTriggerKey(effectTrigger)}
      gradient={gradient}
      iconColor={theme.color(color)}
      iconSize={spacing[size]}
      renderingMode={renderingMode}
      resourceName={iconResourceName(name)}
      secondaryColor={secondaryColor ? theme.color(secondaryColor) : undefined}
      tertiaryColor={tertiaryColor ? theme.color(tertiaryColor) : undefined}
      transition={transition}
      variableValue={variableValue}
    />
  )
}
