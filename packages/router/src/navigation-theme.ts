import {type FontWeight, fontFace, type PaletteColor, resolvePaletteColor, type Theme} from '@hzblj/kara-theme'
import {DefaultTheme, type Theme as NavigationTheme} from 'expo-router'

type NavigationFont = NavigationTheme['fonts']['regular']

/**
 * React Navigation types every colour as `string`, but the values only ever end up in a React Native
 * style — which accepts any `ColorValue`, including the opaque `PlatformColor` a system token resolves to
 * on iOS. Narrowing here rather than at each call site keeps the assertion to one place.
 */
const navColor = (theme: Theme, value: PaletteColor): string => resolvePaletteColor(theme, value) as string

/**
 * The app's own face for that weight where the theme names one, and React Navigation's platform default otherwise —
 * which is the platform's face too, so headers and tab labels follow the same typeface as every other piece of text.
 */
const navFont = (theme: Theme, weight: FontWeight, fallback: NavigationFont): NavigationFont => {
  const fontFamily = fontFace(theme.fonts, weight)

  return fontFamily ? {fontFamily, fontWeight: fallback.fontWeight} : fallback
}

/**
 * Maps the active theme onto React Navigation's, for expo-router's `ThemeProvider`. Call it inside
 * `KaraProvider` with `useAppTheme()`, so the system half of the palette is resolved for the same variant.
 */
export const navigationTheme = (theme: Theme): NavigationTheme => ({
  colors: {
    background: 'transparent',
    border: navColor(theme, theme.border.secondary.base),
    card: navColor(theme, theme.surface.primary),
    notification: navColor(theme, theme.fill.accent.primary),
    primary: navColor(theme, theme.fill.accent.primary),
    text: navColor(theme, theme.content.primary),
  },
  dark: theme.dark,
  fonts: {
    bold: navFont(theme, 'bold', DefaultTheme.fonts.bold),
    heavy: navFont(theme, 'bold', DefaultTheme.fonts.heavy),
    medium: navFont(theme, 'medium', DefaultTheme.fonts.medium),
    regular: navFont(theme, 'regular', DefaultTheme.fonts.regular),
  },
})
