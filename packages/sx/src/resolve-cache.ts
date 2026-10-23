import type {Theme} from '@hzblj/kara-theme'

import {presentKeys} from './present-keys'
import {valueKey} from './value-key'

type StyleResolver<TProps, TStyle> = (props: TProps, theme: Theme) => TStyle

/**
 * `resolve` takes `TProps`, `split` hands back `TInput`. The same surface, except that props reach
 * `split` straight off a component with responsive values still in them, and reach `resolve` only once
 * `flattenSx` has collapsed those — so a caller who splits has to flatten before it can resolve.
 * Defaults to `TProps`, for a cache whose surface has nothing responsive in it.
 */
export type SxCache<TProps, TStyle, TInput = TProps> = {
  resolve: (props: TProps, theme: Theme) => TStyle
  split: <T extends Record<string, unknown>>(props: T) => [TInput, Record<string, unknown>]
}

/**
 * Token-typed values keep the key space small, but `sx` also takes free-form numbers — an `sx`
 * driven per frame would otherwise grow the map for the life of the app. Past the cap the whole map
 * resets: re-resolving is cheap, and an LRU would tax every hit to soften a rare misuse.
 */
const MAX_CACHE_ENTRIES = 1024

const identities = new WeakMap<object, string>()

let nextIdentity = 0

/**
 * The variant alone does not identify a theme's colours. On Android the palette resolver closes over a Material
 * scheme generated at runtime, which can change while the variant stays put — a new seed, or a wallpaper change on
 * Android 12+ — and on both platforms the app's own overrides decide what a token's hex is. Keying on the identity of
 * the resolver *and* of the palette is what stops a resolved style outliving the colours it was built from. Both are
 * memoised by the provider, so a steady theme costs one entry each.
 */
const identity = (value: object): string => {
  const existing = identities.get(value)

  if (existing) {
    return existing
  }

  nextIdentity += 1

  const id = `#${nextIdentity}`
  identities.set(value, id)

  return id
}

const themeKeys = new WeakMap<Theme, string>()

/**
 * The theme's part of every key — worked out once per theme object, which the provider memoises, not per resolve.
 * Exported for the modifier caches, which key the same way.
 */
export const themeKey = (theme: Theme): string => {
  const existing = themeKeys.get(theme)

  if (existing) {
    return existing
  }

  const key = `${theme.dark ? 'd' : 'l'}${identity(theme.resolver)}${identity(theme.palette)}`
  themeKeys.set(theme, key)

  return key
}

export const createSxCache = <TProps extends Record<string, unknown>, TStyle, TInput = TProps>(
  keys: readonly (keyof TProps & string)[],
  resolver: StyleResolver<TProps, TStyle>
): SxCache<TProps, TStyle, TInput> => {
  const cache = new Map<string, TStyle>()
  const keySet = new Set<string>(keys)

  const cacheKey = (props: TProps, theme: Theme) => {
    let key = themeKey(theme)

    for (const name of presentKeys(props, keySet)) {
      key += `|${name}:${valueKey(props[name])}`
    }

    return key
  }

  return {
    resolve: (props, theme) => {
      const key = cacheKey(props, theme)
      const cached = cache.get(key)

      if (cached) {
        return cached
      }

      if (cache.size >= MAX_CACHE_ENTRIES) {
        cache.clear()
      }

      const style = resolver(props, theme)

      // Shared from here on: whatever wrote into it would restyle every view with the same `sx`.
      if (__DEV__) {
        Object.freeze(style)
      }

      cache.set(key, style)

      return style
    },
    split: props => {
      const owned: Record<string, unknown> = {}
      const rest: Record<string, unknown> = {}

      for (const name of Object.keys(props)) {
        if (keySet.has(name)) {
          owned[name] = props[name]
        } else {
          rest[name] = props[name]
        }
      }

      return [owned as TInput, rest]
    },
  }
}
