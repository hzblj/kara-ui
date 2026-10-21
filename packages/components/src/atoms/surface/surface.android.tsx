import {Column, Surface as ComposeSurface, Shape} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {radii, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {SurfaceComponent, SurfaceProps} from './surface.types'

const cornerRadii = (radius: number) => ({bottomEnd: radius, bottomStart: radius, topEnd: radius, topStart: radius})

/**
 * Material's `Surface`, with the padding on a `Column` inside it. Compose applies a `Surface`'s own modifiers before it
 * draws the shape, so padding there would inset the background instead of the content — and a bare `Surface` stacks
 * its children on top of each other rather than in a column.
 */
export const Surface: SurfaceComponent = ({
  children,
  glass = false,
  p = 's16',
  pb,
  pl,
  pr,
  pt,
  px,
  py,
  testID,
  ...sx
}: SurfaceProps) => {
  useHostGuard('Surface')

  const theme = useAppTheme()
  const sxModifiers = useSxModifiers({...sx, bg: undefined})
  const modifiers = useMemo(
    () => (testID ? [...sxModifiers, testIdModifier(testID)] : sxModifiers),
    [sxModifiers, testID]
  )
  const contentModifiers = useSxModifiers({p, pb, pl, pr, pt, px, py, wide: sx.wide})

  return (
    <ComposeSurface
      color={theme.color(sx.bg ?? 'surface.primary')}
      contentColor={theme.color('content.primary')}
      modifiers={modifiers}
      shape={Shape.RoundedCorner({cornerRadii: cornerRadii(radii[sx.borderRadius ?? 'large'])})}
      tonalElevation={glass ? 3 : 0}
    >
      <Column modifiers={contentModifiers}>{children}</Column>
    </ComposeSurface>
  )
}
