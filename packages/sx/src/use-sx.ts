import {useAppTheme, useBreakpoint} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'

import {flattenSx} from './flatten-sx'
import type {MotionProps} from './motion.types'
import {type ResponsiveViewSx, type ResponsiveViewSxKey, VIEW_RESPONSIVE_KEYS} from './responsive-sx'
import {MOTION_KEYS, type SxMotion, useMotion} from './use-motion'
import type {ViewSx} from './view-sx.types'
import {VIEW_SX_KEYS, viewSxCache} from './view-sx-to-style'

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

const VIEW_KEY_SET = new Set<string>(VIEW_SX_KEYS)

const MOTION_KEY_SET = new Set<string>(MOTION_KEYS)

/** Shared by every view without motion, which is most of them: no object to allocate per render. */
const NO_MOTION: MotionProps = Object.freeze({})

/** One walk over the props for all three: the `sx` keys, the motion props and the rest for the wrapped component. */
const splitSxMotion = (props: Record<string, unknown>): [ResponsiveViewSx, MotionProps, Record<string, unknown>] => {
  const own: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  let motion: Record<string, unknown> | undefined

  for (const name of Object.keys(props)) {
    if (VIEW_KEY_SET.has(name)) {
      own[name] = props[name]
    } else if (MOTION_KEY_SET.has(name)) {
      motion ??= {}
      motion[name] = props[name]
    } else {
      rest[name] = props[name]
    }
  }

  return [own as ResponsiveViewSx, (motion ?? NO_MOTION) as MotionProps, rest]
}

/**
 * `useSplitSx` with the motion props split off too and resolved: the style, what the Reanimated twin takes, and the
 * rest. What `sx()` runs on, for the components that own their `style` and still take `entering`, `animate` and the
 * others (`RnText`, `Pressable`). `motion.animated` says whether the props asked for Reanimated; the component
 * latches it with `useAnimatedLatch`, together with whatever its `style` holds.
 */
export const useSplitSxMotion = (props: Record<string, unknown>): [ViewStyle, SxMotion, Record<string, unknown>] => {
  const [own, motionProps, rest] = splitSxMotion(props)
  const style = useSx(own)

  return [style, useMotion(motionProps, style), rest]
}
