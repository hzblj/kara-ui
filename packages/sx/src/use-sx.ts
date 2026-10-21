import {useAppTheme, useBreakpoint} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'

import {flattenSx} from './flatten-sx'
import {type ResponsiveViewSx, type ResponsiveViewSxKey, VIEW_RESPONSIVE_KEYS} from './responsive-sx'
import type {ViewSx} from './view-sx.types'
import {viewSxCache} from './view-sx-to-style'

/**
 * Resolves an `sx` object into a React Native style. Needs no `useMemo`: the cache keys on the
 * flattened sx values, so the same sx at the same breakpoint hands back the very same object every
 * render — and across components.
 */
export const useSx = (sx: ResponsiveViewSx): ViewStyle => {
  const theme = useAppTheme()
  const breakpoint = useBreakpoint()

  return viewSxCache.resolve(flattenSx<ViewSx, ResponsiveViewSxKey>(sx, VIEW_RESPONSIVE_KEYS, breakpoint), theme)
}

/**
 * `useSx` for a component whose own props arrive mixed in with the `sx` ones: the `sx` keys are split
 * off and resolved, and the rest is handed back untouched. What `sx()` does internally, exposed for the
 * components that cannot be built on it because they own their `style` prop — an animated one, or a
 * `ScrollView` styling two boxes at once.
 */
export const useSplitSx = <TProps extends Record<string, unknown>>(
  props: TProps
): [ViewStyle, Record<string, unknown>] => {
  const [own, rest] = viewSxCache.split(props)
  const style = useSx(own)

  return [style, rest]
}
