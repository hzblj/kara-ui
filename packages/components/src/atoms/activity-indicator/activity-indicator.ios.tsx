import {RNHostView} from '@expo/ui/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {ActivityIndicator as RNActivityIndicator} from 'react-native'

import {useInsideHost} from '../../hooks/host-context'
import type {ActivityIndicatorComponent, ActivityIndicatorProps} from './activity-indicator.types'

/**
 * React Native's spinner, which on iOS is UIKit's own `UIActivityIndicatorView`. Inside a `Screen` or `Island` it is
 * carried into that host by `RNHostView`, sized to the spinner (see `useInsideHost`).
 */
export const ActivityIndicator: ActivityIndicatorComponent = ({
  accessibilityLabel,
  color = 'fill.accent.primary',
  size = 'small',
  testID,
}: ActivityIndicatorProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()

  const spinner = (
    <RNActivityIndicator
      accessibilityLabel={accessibilityLabel}
      color={theme.color(color)}
      size={size}
      testID={testID}
    />
  )

  return insideHost ? <RNHostView matchContents>{spinner}</RNHostView> : spinner
}
