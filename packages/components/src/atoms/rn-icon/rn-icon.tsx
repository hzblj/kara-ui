import {NativeIcon} from '@hzblj/expo-native-icons'
import {spacing, useAppTheme} from '@hzblj/kara-theme'

import type {RnIconComponent, RnIconProps} from './rn-icon.types'

/**
 * `@hzblj/expo-native-icons`' `NativeIcon`: a `UIImageView` over the app's custom SF Symbol on iOS, one view drawing
 * its vector drawable on Android, with the effects, transitions and rendering modes on both. What a list row wants,
 * rather than a SwiftUI or Compose host per row.
 */
export const RnIcon: RnIconComponent = ({
  color = 'content.primary',
  secondaryColor,
  size = 's24',
  tertiaryColor,
  ...props
}: RnIconProps) => {
  const theme = useAppTheme()

  return (
    <NativeIcon
      {...props}
      color={theme.color(color)}
      secondaryColor={secondaryColor ? theme.color(secondaryColor) : undefined}
      size={spacing[size]}
      tertiaryColor={tertiaryColor ? theme.color(tertiaryColor) : undefined}
    />
  )
}
