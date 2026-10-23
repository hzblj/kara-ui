import type {Theme} from '@hzblj/kara-theme'

import {themeKey} from './resolve-cache'
import type {FrameAlignment, Sx} from './sx.types'

type ModifierResolver<TModifier> = (sx: Sx, theme: Theme, alignment?: FrameAlignment, reduced?: boolean) => TModifier[]

/** The style cache's bound, for the same reason: a free-form number driven per frame would grow it forever. */
const MAX_ENTRIES = 1024

/**
 * Shares resolved modifier arrays across views, the way the style cache shares styles: a list of fifty rows with the
 * same `HStack` sx resolves it once, not fifty times. Keyed by the theme, the alignment, Reduce Motion (where an
 * `animate` reads it) and `sxKey`. A bucket's
 * `modifiers` escape hatch holds opaque configs `sxKey` cannot see, so an `sx` carrying one is resolved on its own.
 */
export const createModifierCache = <TModifier>(resolver: ModifierResolver<TModifier>) => {
  const cache = new Map<string, TModifier[]>()

  return (
    sx: Sx,
    key: string,
    theme: Theme,
    alignment: FrameAlignment | undefined,
    reduced: boolean,
    opaque: boolean
  ): TModifier[] => {
    if (opaque) {
      return resolver(sx, theme, alignment, reduced)
    }

    // `reduced` changes only what an `animate` resolves to, so the views without one keep sharing a single entry.
    const fullKey = `${themeKey(theme)}|${alignment ?? ''}${reduced ? '|reduced' : ''}${key}`
    const cached = cache.get(fullKey)

    if (cached) {
      return cached
    }

    if (cache.size >= MAX_ENTRIES) {
      cache.clear()
    }

    const modifiers = resolver(sx, theme, alignment, reduced)

    // Shared from here on: a caller that pushed onto it would change every view holding the same `sx`.
    if (__DEV__) {
      Object.freeze(modifiers)
    }

    cache.set(fullKey, modifiers)

    return modifiers
  }
}
