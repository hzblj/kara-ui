import {isLiquidGlassAvailable} from '@hzblj/kara-native'
import {GlassView as NativeGlassView} from '@hzblj/kara-native/swift-ui'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {GlassFallback} from './glass-fallback'
import type {GlassViewComponent, GlassViewProps} from './glass-view.types'

/**
 * The native view is a capsule by construction — its corner radius follows its bounds — so `borderRadius` is the
 * fallback's business only.
 */
const LiquidGlass = ({children, interactive = false, testID, tint, ...sx}: GlassViewProps) => {
  const theme = useAppTheme()
  const style = useSx(sx)

  return (
    <NativeGlassView
      colorScheme={theme.dark ? 'dark' : 'light'}
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
