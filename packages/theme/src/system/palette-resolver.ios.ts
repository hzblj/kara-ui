import {DynamicColorIOS, PlatformColor} from 'react-native'

import type {AdaptiveColorRef, NativeColorRef} from '../primitives/color-source'
import type {ResolvedColor} from '../theme.types'
import type {PaletteResolver, UsePaletteResolver} from './palette-resolver.types'

/**
 * Keyed by the reference object, which the palette creates once at import — so each colour is built once for the life
 * of the app and keeps a stable identity. That matters beyond allocation: the `sx` caches hold resolved styles, and a
 * fresh handle per resolve would make equal styles compare unequal.
 */
const resolved = new WeakMap<AdaptiveColorRef | NativeColorRef, ResolvedColor>()

const memoise = (ref: AdaptiveColorRef | NativeColorRef, build: () => ResolvedColor): ResolvedColor => {
  const existing = resolved.get(ref)

  if (existing) {
    return existing
  }

  const color = build()
  resolved.set(ref, color)

  return color
}

/**
 * A `PlatformColor` is a handle, not a value: UIKit resolves it against the trait collection of whatever draws it, so
 * the light/dark switch happens natively — *inside* the appearance cross-fade — and increased contrast comes free.
 * `DynamicColorIOS` gives the same trait-reactive behaviour over our own values, which is what an entry falls back to
 * where iOS was given no semantic of its own.
 */
const nativeColor = (ref: NativeColorRef): ResolvedColor =>
  memoise(ref, () => {
    const source = ref.native

    if (!('light' in source)) {
      return PlatformColor(source.ios)
    }

    return source.ios ? PlatformColor(source.ios) : DynamicColorIOS(source)
  })

const adaptiveColor = (ref: AdaptiveColorRef): ResolvedColor => memoise(ref, () => DynamicColorIOS(ref.adaptive))

const resolver: PaletteResolver = {adaptive: adaptiveColor, native: nativeColor}

export const paletteResolver: UsePaletteResolver = () => resolver

export const usePaletteResolver: UsePaletteResolver = () => resolver
