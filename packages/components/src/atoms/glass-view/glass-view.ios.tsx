import {isLiquidGlassAvailable} from '@hzblj/kara-native'
import {GlassView as NativeGlassView} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {radii, useAppTheme} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'
import {GlassFallback} from './glass-fallback'
import type {GlassViewComponent, GlassViewProps} from './glass-view.types'

/**
 * The native view is a capsule until it gets a `cornerRadius`, which comes from the resolved `borderRadius` — after
 * breakpoints, so a responsive radius works too. `full` stays the capsule, which follows the view's bounds exactly.
 */
const toCornerRadius = (borderRadius: ViewStyle['borderRadius']) =>
  typeof borderRadius === 'number' && borderRadius < radii.full ? borderRadius : undefined

const LiquidGlass = ({children, interactive = false, testID, tint, variant = 'regular', ...sx}: GlassViewProps) => {
  const theme = useAppTheme()
  const style = useSx(sx)

  return (
    <NativeGlassView
      colorScheme={theme.dark ? 'dark' : 'light'}
      cornerRadius={toCornerRadius(style.borderRadius)}
      glassStyle={variant}
      glassTint={tint ? theme.color(tint) : undefined}
      isInteractive={interactive}
      style={style}
      testID={testID}
    >
      {children}
    </NativeGlassView>
  )
}

export const GlassView: GlassViewComponent = (props: GlassViewProps) =>
  isLiquidGlassAvailable() ? <LiquidGlass {...props} /> : <GlassFallback {...props} />
