import type {AdaptiveColorRef, NativeColorRef} from '../primitives/color-source'
import type {ResolvedColor, ThemeVariant} from '../theme.types'

/**
 * Turns the two kinds of deferred palette entry into something the bridges accept. Split per platform because the
 * mechanisms have nothing in common: iOS hands back handles it never rebuilds, Android reads values out of the live
 * Material scheme and has to.
 */
export type PaletteResolver = {
  /** Our values, switched by the platform where it can. */
  adaptive: (ref: AdaptiveColorRef) => ResolvedColor
  /** The platform's own colour where this token named one, ours where it did not. */
  native: (ref: NativeColorRef) => ResolvedColor
}

/**
 * The `variant` argument is what the app already settled on (stored preference folded in), so the Android side never
 * asks the OS a second time and disagrees with what iOS was told. `seedColor` is the theme's `materialSeed`, which
 * Android grows its Material scheme from (`undefined`: the wallpaper). iOS ignores both: its handles are variant-blind
 * and it has no generated scheme.
 */
export type UsePaletteResolver = (variant: ThemeVariant, seedColor?: string) => PaletteResolver
