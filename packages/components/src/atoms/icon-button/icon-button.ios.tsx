import {Button} from '@expo/ui/swift-ui'
import {
  buttonBorderShape,
  buttonStyle,
  contentShape,
  disabled as disabledModifier,
  shapes,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers'
import {isLiquidGlassAvailable} from '@hzblj/kara-native'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {type ColorToken, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {ButtonStyleName} from '../button/button.types'
import {contentOnTint} from '../button/button-tokens'
import {Icon} from '../icon'
import {ZStack} from '../z-stack'
import type {IconButtonComponent, IconButtonProps, IconButtonVariant} from './icon-button.types'

/** Apple's least tap target. Android's `IconButton` is Material's 48dp; this is the same idea in points. */
const TARGET = 44

/** Material's 40dp container, the ring an `outlined` button draws inside its tap target. */
const RING = 40

/** The whole square takes the tap, not only the glyph's own pixels. */
const WHOLE_TARGET = {modifiers: [contentShape(shapes.circle())]}

/**
 * The SwiftUI style behind each variant. `outlined` has none (SwiftUI draws no ring around a button), so it is a plain
 * button whose label draws the ring.
 */
const STYLE_BY_VARIANT = {
  filled: 'borderedProminent',
  glass: 'glass',
  outlined: 'plain',
  plain: 'plain',
  tonal: 'bordered',
} as const satisfies Record<IconButtonVariant, ButtonStyleName>

export const IconButton: IconButtonComponent = ({
  accessibilityHint,
  accessibilityLabel,
  color,
  disabled = false,
  name,
  onPress,
  testID,
  variant = 'plain',
}: IconButtonProps) => {
  useHostGuard('IconButton')
  const theme = useAppTheme()
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityHint})
  // Below iOS 26 `@expo/ui` turns `.glass` into `.automatic`, a bare icon; the tonal circle is what Android draws too.
  const style = variant === 'glass' && !isLiquidGlassAvailable() ? 'bordered' : STYLE_BY_VARIANT[variant]
  const bezel = style !== 'plain'

  /**
   * `filled` takes the colour as its fill, and the icon a colour that reads on it. `tonal` passes it as the tint too,
   * which SwiftUI's bordered style draws its pale circle in. SwiftUI dims a disabled button's label itself, and greys a
   * prominent one's fill, so a disabled filled icon goes back to the primary content colour rather than white on grey.
   */
  const fill: ColorToken | undefined = variant === 'filled' ? (color ?? 'fill.accent.primary') : undefined
  const tint = fill ?? (variant === 'tonal' ? color : undefined)
  const iconColor: ColorToken = fill
    ? disabled
      ? 'content.primary'
      : color
        ? contentOnTint(color, theme)
        : 'content.on.accent'
    : (color ?? 'content.primary')

  const modifiers = useMemo(() => {
    const list = [buttonStyle(style)]

    if (bezel) {
      list.push(buttonBorderShape('circle'))
    }

    if (tint) {
      list.push(tintModifier(theme.color(tint)))
    }

    list.push(...accessibilityModifiers)

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [accessibilityModifiers, bezel, disabled, style, theme, tint])

  // A bezel style sizes its circle around the icon itself; a plain button's label is the whole target.
  const icon = <Icon accessibilityLabel={accessibilityLabel} color={iconColor} name={name} />

  return (
    <Button modifiers={modifiers} onPress={onPress} testID={testID}>
      {bezel ? (
        icon
      ) : (
        <ZStack h={TARGET} ios={WHOLE_TARGET} w={TARGET}>
          {variant === 'outlined' ? (
            <ZStack borderColor="border.secondary.base" borderRadius="full" borderWidth={1} h={RING} w={RING}>
              {icon}
            </ZStack>
          ) : (
            icon
          )}
        </ZStack>
      )}
    </Button>
  )
}
