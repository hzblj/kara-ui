import {Image} from '@expo/ui/swift-ui'
import {accessibilityHidden, frame, accessibilityLabel as labelModifier, resizable} from '@expo/ui/swift-ui/modifiers'
import {iconResourceName} from '@hzblj/kara-native'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {IconComponent, IconProps} from './icon.types'

/**
 * The app's icon from its asset catalog — the template image set the config plugin generated from the SVG, vector data
 * kept, so `resizable()` scales it crisply to the token size and the platform tints it.
 */
export const Icon: IconComponent = ({
  accessibilityLabel,
  color = 'content.primary',
  name,
  size = 's24',
  testID,
}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()
  const side = spacing[size]

  const modifiers = useMemo(
    () => [
      resizable(),
      frame({height: side, width: side}),
      accessibilityLabel ? labelModifier(accessibilityLabel) : accessibilityHidden(true),
    ],
    [accessibilityLabel, side]
  )

  return <Image assetName={iconResourceName(name)} color={theme.color(color)} modifiers={modifiers} testID={testID} />
}
