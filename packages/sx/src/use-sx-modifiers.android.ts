import type {ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme, useBreakpoint, useReducedMotion} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {flattenSx} from './flatten-sx'
import {createModifierCache} from './modifier-cache'
import {type ResponsiveSx, type ResponsiveSxKey, SX_RESPONSIVE_KEYS} from './responsive-sx'
import type {FrameAlignment, Sx} from './sx.types'
import {sxKey} from './sx-key'
import {sxToModifiers} from './sx-to-modifiers'

const resolveModifiers = createModifierCache(sxToModifiers)

/**
 * `sxToModifiers` behind a `useMemo`, so a re-render hands the native view the modifier array it is
 * already holding instead of an equal-but-new one to diff, and behind `createModifierCache`, so views with the same
 * `sx` share one array instead of each resolving its own.
 *
 * The responsive flattening happens before `sxKey`, so the key describes the values actually applied
 * at this breakpoint — a rotation to a wider window changes it, and nothing else does.
 *
 * `android.modifiers` is depended on by identity, because `sxKey` cannot flatten opaque modifier
 * configs into a string. A call site that builds that array inline therefore re-resolves every render.
 */
export const useSxModifiers = (sx: ResponsiveSx, alignment?: FrameAlignment): ModifierConfig[] => {
  const theme = useAppTheme()
  const breakpoint = useBreakpoint()
  // Read only for `animate`, but always: a hook cannot be conditional, and a context read costs next to nothing.
  const reduced = useReducedMotion() && sx.animate !== undefined
  const flat = flattenSx<Sx, ResponsiveSxKey>(sx, SX_RESPONSIVE_KEYS, breakpoint)
  const key = sxKey(flat)
  const escapeHatch = sx.android?.modifiers

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands in for `flat` — see `sxKey`
  return useMemo(
    () => resolveModifiers(flat, key, theme, alignment, reduced, escapeHatch !== undefined),
    [alignment, escapeHatch, key, reduced, theme]
  )
}
