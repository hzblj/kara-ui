import type {ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme, useBreakpoint} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {flattenSx} from './flatten-sx'
import {type ResponsiveSx, type ResponsiveSxKey, SX_RESPONSIVE_KEYS} from './responsive-sx'
import type {FrameAlignment, Sx} from './sx.types'
import {sxKey} from './sx-key'
import {sxToModifiers} from './sx-to-modifiers'

/**
 * `sxToModifiers` behind a `useMemo`, so a re-render hands the native view the modifier array it is
 * already holding instead of an equal-but-new one to diff.
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
  const flat = flattenSx<Sx, ResponsiveSxKey>(sx, SX_RESPONSIVE_KEYS, breakpoint)
  const key = sxKey(flat)
  const escapeHatch = sx.android?.modifiers

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands in for `flat` — see `sxKey`
  return useMemo(() => sxToModifiers(flat, theme, alignment), [alignment, escapeHatch, key, theme])
}
