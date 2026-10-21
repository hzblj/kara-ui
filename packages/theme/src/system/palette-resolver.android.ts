import {getMaterialColors, isDynamicColorAvailable} from '@expo/ui/jetpack-compose'
import {useEffect, useMemo, useState} from 'react'
import {AppState} from 'react-native'
import type {AdaptiveTuple} from '../primitives/color-source'
import type {ResolvedColor, ThemeVariant} from '../theme.types'
import type {PaletteResolver} from './palette-resolver.types'

/**
 * Material roles arrive as `#RRGGBBAA`, so — unlike iOS — this resolver holds values and is rebuilt when the variant
 * changes. `PlatformColor` is not an option: React Native's Android colours are `{resource_paths: [...]}` objects, and
 * `expo-modules-core`'s converter takes only a number, string or array, so handing one to an `@expo/ui` modifier throws
 * rather than degrading.
 *
 * Neither is there a per-colour equivalent of `DynamicColorIOS`, which is the one real asymmetry in the design: on this
 * platform a colour of *ours* switches on a JS re-render rather than inside the OS animation. Only a Material role
 * adapts natively here, and no plugin can redefine one — the scheme is computed from the wallpaper, the seed or the M3
 * baseline, none of which an app can reach into. The theme's `materialSeed` (or `dynamicColor`) is the only lever.
 *
 * With no seed the scheme is the wallpaper's on Android 12+, and the baseline below it.
 */
export const paletteResolver = (variant: ThemeVariant, seedColor?: string): PaletteResolver => {
  const material = getMaterialColors({scheme: variant, seedColor})
  const isDark = variant === 'dark'
  const ownValue = (tuple: AdaptiveTuple): ResolvedColor => (isDark ? tuple.dark : tuple.light)

  return {
    adaptive: ref => ownValue(ref.adaptive),
    native: ref => {
      const source = ref.native

      if (!('light' in source)) {
        return material[source.android]
      }

      return source.android ? material[source.android] : ownValue(source)
    },
  }
}

/**
 * The roles a wallpaper change always moves, read fresh from the OS — `@expo/ui` caches seeded palettes only, so an
 * unseeded read is the wallpaper as it is now.
 */
const wallpaperFingerprint = (variant: ThemeVariant): string => {
  const {primary, secondary, surface, tertiary} = getMaterialColors({scheme: variant})

  return `${primary}${secondary}${tertiary}${surface}`
}

/**
 * The wallpaper can change while the app runs — in the system settings, which the user then leaves to come back. So
 * while the scheme follows the wallpaper it is fingerprinted again each time the app returns to the foreground, and
 * only a fingerprint that moved rebuilds the resolver: an unchanged wallpaper costs one native call and no render.
 */
const useWallpaperFingerprint = (variant: ThemeVariant, followsWallpaper: boolean): string => {
  const [fingerprint, setFingerprint] = useState(() => (followsWallpaper ? wallpaperFingerprint(variant) : ''))

  useEffect(() => {
    if (!followsWallpaper) {
      return
    }

    const refresh = () => setFingerprint(wallpaperFingerprint(variant))
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh()
      }
    })

    refresh()

    return () => subscription.remove()
  }, [followsWallpaper, variant])

  return fingerprint
}

export const usePaletteResolver = (variant: ThemeVariant, seedColor?: string): PaletteResolver => {
  const fingerprint = useWallpaperFingerprint(variant, seedColor === undefined && isDynamicColorAvailable)

  // biome-ignore lint/correctness/useExhaustiveDependencies: `fingerprint` is the wallpaper's identity — it is not read, it is what makes a new wallpaper rebuild the resolver.
  return useMemo(() => paletteResolver(variant, seedColor), [fingerprint, seedColor, variant])
}
