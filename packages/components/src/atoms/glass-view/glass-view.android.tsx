import {BackdropBlurView} from '@hzblj/kara-native/jetpack-compose'
import {useSx} from '@hzblj/kara-sx'
import {radii, useAppTheme, withOpacity} from '@hzblj/kara-theme'

import type {GlassViewComponent, GlassViewProps} from './glass-view.types'

/** dp. Strong enough that a photo behind reads as colour and light, not as detail. */
const BLUR_RADIUS = 16

/**
 * Frosted glass, Android's way: what lies behind the capsule, blurred (Android 12+), under a tonal Material surface
 * and a light hairline — the blurred surfaces Android 16 gives its own system UI, not a copy of iOS's lens. Without a
 * tint it is the surface colour, translucent, so the content keeps its usual colours on it; a tint fills it with that
 * colour instead. Below Android 12, with nothing to blur, the same colours are drawn near-opaque. Android has no swell,
 * so `interactive` changes nothing here — the `Pressable` around it gives the press its feedback.
 */
export const GlassView: GlassViewComponent = ({
  children,
  interactive: _interactive,
  testID,
  tint,
  ...sx
}: GlassViewProps) => {
  const theme = useAppTheme()
  const style = useSx(sx)
  const base = String(theme.color(tint ?? 'surface.primary'))

  return (
    <BackdropBlurView
      blurRadius={BLUR_RADIUS}
      cornerRadius={radii.full}
      fallbackTint={withOpacity(base, 'o95')}
      glassTint={withOpacity(base, tint ? 'o85' : 'o50')}
      hairlineColor={withOpacity(String(theme.color('content.on.accent')), theme.dark ? 'o20' : 'o60')}
      hairlineWidth={1}
      saturation={1.6}
      style={style}
      testID={testID}
    >
      {children}
    </BackdropBlurView>
  )
}
