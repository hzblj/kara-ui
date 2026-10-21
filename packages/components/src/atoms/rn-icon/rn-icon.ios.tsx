import {iconResourceName} from '@hzblj/kara-native'
import {IconView} from '@hzblj/kara-native/swift-ui'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {RnIconComponent, RnIconProps} from './rn-icon.types'

/** A `UIImageView` over the app's asset-catalog icon — what a list row wants, rather than a SwiftUI host per row. */
export const RnIcon: RnIconComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  name,
  size = 's24',
  testID,
}: RnIconProps) => {
  const theme = useAppTheme()
  const style = useMemo(() => ({height: spacing[size], width: spacing[size]}), [size])

  return (
    <IconView
      accessibilityLabel={accessibilityLabel}
      assetName={iconResourceName(name)}
      iconColor={theme.color(color)}
      style={style}
      testID={testID}
    />
  )
}
