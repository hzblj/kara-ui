import {type ActiveBreakpoint, BREAKPOINT_ORDER, type Breakpoint} from '@hzblj/kara-theme'

import type {ResponsiveOf} from './responsive.types'

/** The runtime shape of a `Responsive` object — what `isResponsive` narrows an `sx` value to. */
type ResponsiveValue = {base: unknown} & Partial<Record<Breakpoint, unknown>>

/**
 * No responsive-capable key takes an object value — each one is a token, a dimension, a number or a
 * boolean — so `base` being present identifies a per-breakpoint value outright, with nothing it could
 * be confused for. That is exactly why the visual keys stay scalar: `scale` and the platform buckets
 * *are* objects, and admitting them would make this test ambiguous.
 */
const isResponsive = (value: unknown): value is ResponsiveValue =>
  typeof value === 'object' && value !== null && 'base' in value

/** Mobile-first: the widest breakpoint declared at or below the active one, falling back to `base`. */
const valueAt = (value: ResponsiveValue, active: ActiveBreakpoint): unknown => {
  let resolved = value.base

  if (active === 'base') {
    return resolved
  }

  for (const name of BREAKPOINT_ORDER) {
    const declared = value[name]

    if (declared !== undefined) {
      resolved = declared
    }

    if (name === active) {
      break
    }
  }

  return resolved
}

/**
 * Collapses a responsive `sx` into the flat one the active breakpoint asks for.
 *
 * Deliberately upstream of the caches rather than inside them: `resolve-cache` and `sxKey` only ever
 * see flat values, so neither their one-level key flattening nor their key space has to grow a
 * breakpoint dimension — and two devices that land on the same flat `sx` still share its entry. A
 * breakpoint folded into the cache key instead would have doubled the entries for every `sx` in the
 * app, responsive or not.
 *
 * Hands back the very object it was given when nothing in it is responsive, which is the overwhelming
 * case: `sx()` wraps every view, and those call sites paying nothing is what keeps it affordable. For
 * the same reason it walks the props the component set rather than `keys`, and asks `keys` only about
 * a value that already looks responsive.
 */
export const flattenSx = <TSx extends object, TKey extends keyof TSx & string>(
  sx: ResponsiveOf<TSx, TKey>,
  keys: readonly TKey[],
  active: ActiveBreakpoint
): TSx => {
  const source = sx as Record<string, unknown>
  let flattened: Record<string, unknown> | undefined

  for (const name of Object.keys(source)) {
    const value = source[name]

    if (isResponsive(value) && keys.includes(name as TKey)) {
      flattened ??= {...source}
      flattened[name] = valueAt(value, active)
    }
  }

  return (flattened ?? source) as TSx
}
