import {iconResourceName} from '@hzblj/expo-native-icons'
import {DrawableIcon} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../hooks/host-context'
import type {IconComponent, IconProps} from './icon.types'

/** The app's icon as the vector drawable the config plugin generated from the SVG, drawn by Material's `Icon`. */
export const Icon: IconComponent = ({accessibilityLabel, color = 'content.primary', name, size = 's24'}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()

  return (
    <DrawableIcon
      accessibilityLabel={accessibilityLabel}
      iconColor={theme.color(color)}
      iconSize={spacing[size]}
      resourceName={iconResourceName(name)}
    />
  )
}
