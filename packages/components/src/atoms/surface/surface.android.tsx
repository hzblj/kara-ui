import {Surface as ComposeSurface, Shape} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {radii, useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import type {SurfaceComponent, SurfaceProps} from './surface.types'

const cornerRadii = (radius: number) => ({bottomEnd: radius, bottomStart: radius, topEnd: radius, topStart: radius})

export const Surface: SurfaceComponent = ({children, glass = false, testID, ...sx}: SurfaceProps) => {
  useHostGuard('Surface')

  const theme = useAppTheme()
  const modifiers = useSxModifiers({...sx, bg: undefined, p: sx.p ?? 's16'})

  return (
    <ComposeSurface
      color={theme.color(sx.bg ?? 'surface.primary')}
      contentColor={theme.color('content.primary')}
      modifiers={modifiers}
      shape={Shape.RoundedCorner({cornerRadii: cornerRadii(radii[sx.borderRadius ?? 'large'])})}
      tonalElevation={glass ? 3 : 0}
    >
      {children}
    </ComposeSurface>
  )
}
