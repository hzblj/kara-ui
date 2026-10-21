import {iconResourceName} from '@hzblj/kara-native'
import {IconView} from '@hzblj/kara-native/jetpack-compose'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {RnIconComponent, RnIconProps} from './rn-icon.types'

/** An `ImageView` over the app's vector drawable — what a list row wants, rather than a Compose host per row. */
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
      iconColor={theme.color(color)}
      resourceName={iconResourceName(name)}
      style={style}
      testID={testID}
    />
  )
}
