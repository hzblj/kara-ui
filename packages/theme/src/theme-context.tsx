import {createContext, type ReactNode, useContext, useMemo} from 'react'

import {defaultMaterialSeed} from './primitives/color-source'
import {type FontsConfig, resolveTypography, type Typography} from './primitives/typography'
import {isDynamicColorSupported} from './system/dynamic-color'
import {paletteResolver, usePaletteResolver} from './system/palette-resolver'
import type {PaletteResolver} from './system/palette-resolver.types'
import type {Theme, ThemeVariant} from './theme.types'
import {mergePalette, type ThemeConfig} from './theme-config'
import {withDynamicAccent} from './themes/dynamic-accent'
import type {Palette} from './themes/palette'
import {rgbaPalette} from './themes/rgba-palette'
import {resolveColor, resolveColorString} from './utils'

const ThemeContext = createContext<Theme | null>(null)

/** Everything a theme is built from that does not depend on the variant — worked out once per config. */
type ThemeSource = {
  dynamicColor: boolean
  fonts: FontsConfig
  materialSeed: string | undefined
  palette: Palette
  typography: Typography
}

/** `undefined` hands Android's scheme to the wallpaper — asked for outright, or as part of `dynamicColor`. */
const seedFor = (config: ThemeConfig | undefined, dynamicColor: boolean): string | undefined => {
  if (dynamicColor || config?.materialSeed === null) {
    return undefined
  }

  return config?.materialSeed ?? defaultMaterialSeed
}

const themeSource = (config: ThemeConfig | undefined): ThemeSource => {
  const merged = mergePalette(config?.colors)
  const palette = config?.dynamicColor ? withDynamicAccent(merged) : merged
  const dynamicColor = config?.dynamicColor === true && isDynamicColorSupported()

  return {
    dynamicColor,
    fonts: config?.fonts ?? {},
    materialSeed: seedFor(config, dynamicColor),
    palette,
    typography: resolveTypography(config?.fonts),
  }
}

/**
 * `color`, `colorString` and the `rgba` mirror close over the theme they belong to, so they are named inside the same
 * initializer that builds it — legal because none of them runs during construction, and it is what lets a component
 * write `theme.color('surface.base')` rather than thread the theme through a free function.
 */
const toTheme = (source: ThemeSource, variant: ThemeVariant, resolver: PaletteResolver): Theme => {
  const theme: Theme = {
    ...source.palette,
    color: token => resolveColor(theme, token),
    colorString: token => resolveColorString(theme, token),
    dark: variant === 'dark',
    dynamicColor: source.dynamicColor,
    fonts: source.fonts,
    materialSeed: source.materialSeed,
    palette: source.palette,
    resolver,
    rgba: rgbaPalette(source.palette, token => resolveColor(theme, token)),
    typography: source.typography,
  }

  return theme
}

type AppThemeProviderProps = {
  children: ReactNode
  /** The app's overrides. Keep it referentially stable — declare it at module scope, or memoise it. */
  config?: ThemeConfig
  variant: ThemeVariant
}

export const AppThemeProvider = ({children, config, variant}: AppThemeProviderProps) => {
  const source = useMemo(() => themeSource(config), [config])
  const resolver = usePaletteResolver(variant, source.materialSeed)
  const theme = useMemo(() => toTheme(source, variant, resolver), [resolver, source, variant])

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

let fallbackTheme: Theme | undefined

const buildFallbackTheme = (): Theme => {
  const source = themeSource(undefined)

  return toTheme(source, 'light', paletteResolver('light', source.materialSeed))
}

/**
 * Defaults to the light default theme with no provider above, but the fallback is built on first use rather than at
 * import. On Android resolving the palette means calling into the Material scheme, and doing that while this module is
 * still evaluating would tie every consumer of the theme to native readiness just to import a spacing token.
 */
export const useAppTheme = (): Theme => {
  const theme = useContext(ThemeContext)

  if (theme) {
    return theme
  }

  fallbackTheme ??= buildFallbackTheme()

  return fallbackTheme
}
