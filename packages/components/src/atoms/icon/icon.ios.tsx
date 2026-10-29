import {Image} from '@expo/ui/swift-ui'
import {accessibilityHidden, frame, imageScale, accessibilityLabel as labelModifier} from '@expo/ui/swift-ui/modifiers'
import {iconSymbolName, nativeIconEffectRecord, nativeIconTriggerKey} from '@hzblj/expo-native-icons'
import {symbolStyle} from '@hzblj/kara-native/swift-ui'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {IconComponent, IconProps} from './icon.types'

/**
 * The app's icon as the custom SF Symbol the config plugin generated from the SVG. At the small symbol scale its box is
 * its point size, so the token size is the font size and the box fills the frame, the same size the image was. The
 * `symbolStyle` modifier colours it and plays its effects and transitions, the way `NativeIconView` does in UIKit.
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
  testID,
  transition,
  variableValue,
}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()
  const side = spacing[size]
  const symbol = iconSymbolName(name)
  const effectKey = effect ? JSON.stringify(effect) : undefined

  const modifiers = useMemo(
    () => [
      imageScale('small'),
      symbolStyle({
        color: theme.color(color),
        effect: effectKey ? nativeIconEffectRecord(JSON.parse(effectKey)) : undefined,
        effectActive,
        effectTrigger: nativeIconTriggerKey(effectTrigger),
        gradient,
        renderingMode,
        secondaryColor: secondaryColor ? theme.color(secondaryColor) : undefined,
        tertiaryColor: tertiaryColor ? theme.color(tertiaryColor) : undefined,
        transition,
        transitionValue: `${symbol}:${variableValue ?? ''}`,
      }),
      frame({height: side, width: side}),
      accessibilityLabel ? labelModifier(accessibilityLabel) : accessibilityHidden(true),
    ],
    [
      accessibilityLabel,
      color,
      effectActive,
      effectKey,
      effectTrigger,
      gradient,
      renderingMode,
      secondaryColor,
      side,
      symbol,
      tertiaryColor,
      theme,
      transition,
      variableValue,
    ]
  )

  return <Image assetName={symbol} modifiers={modifiers} size={side} testID={testID} variableValue={variableValue} />
}
