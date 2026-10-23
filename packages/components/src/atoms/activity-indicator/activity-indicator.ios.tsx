import {useAppTheme} from '@hzblj/kara-theme'
import {ActivityIndicator as RNActivityIndicator} from 'react-native'

import type {ActivityIndicatorComponent, ActivityIndicatorProps} from './activity-indicator.types'

/** React Native's spinner, which on iOS is UIKit's own `UIActivityIndicatorView`. */
export const ActivityIndicator: ActivityIndicatorComponent = ({
  accessibilityLabel,
  color = 'fill.accent.primary',
  size = 'small',
  testID,
}: ActivityIndicatorProps) => {
  const theme = useAppTheme()

  return (
    <RNActivityIndicator
      accessibilityLabel={accessibilityLabel}
      color={theme.color(color)}
      size={size}
      testID={testID}
    />
  )
}
