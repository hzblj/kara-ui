import {NativeIcon} from '@hzblj/expo-native-icons'
import {spacing, useAppTheme} from '@hzblj/kara-theme'

import type {RnIconComponent, RnIconProps} from './rn-icon.types'

/**
 * `@hzblj/expo-native-icons`' `NativeIcon`: a `UIImageView` over the app's asset-catalog icon on iOS, one view drawing
 * its vector drawable on Android. What a list row wants, rather than a SwiftUI or Compose host per row.
 */
export const RnIcon: RnIconComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  name,
  size = 's24',
  testID,
}: RnIconProps) => {
  const theme = useAppTheme()

  return (
    <NativeIcon
      accessibilityLabel={accessibilityLabel}
      color={theme.color(color)}
      name={name}
      size={spacing[size]}
      testID={testID}
    />
  )
}
