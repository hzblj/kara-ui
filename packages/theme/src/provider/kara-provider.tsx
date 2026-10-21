import {type ReactNode, useMemo} from 'react'
import {type ColorSchemeName, useColorScheme} from 'react-native'

import {BreakpointProvider, useAppearanceOverride} from '../hooks'
import type {ThemePreference, ThemeVariant} from '../theme.types'
import type {ThemeConfig} from '../theme-config'
import {AppThemeProvider} from '../theme-context'

/** What `'system'` resolves to while the platform reports no preference of its own. */
const FALLBACK_VARIANT: ThemeVariant = 'light'

export type KaraProviderProps = {
  children: ReactNode
  /**
   * The app's theme: colour overrides, its own typeface, the Android seed. Omitted, every token keeps its default and
   * text is set in the platform's face. Keep it referentially stable — `defineTheme` at module scope is the usual way.
   */
  theme?: ThemeConfig
  /**
   * `'system'` follows the OS. `'light'` and `'dark'` pin the app to one appearance — on the platform too, not
   * only in React state, so `PlatformColor`s in the React Native tier and the SwiftUI/Compose hosts agree.
   */
  themePreference?: ThemePreference
}

const variantFor = (preference: ThemePreference, colorScheme: ColorSchemeName): ThemeVariant => {
  if (preference !== 'system') {
    return preference
  }

  return colorScheme === 'dark' || colorScheme === 'light' ? colorScheme : FALLBACK_VARIANT
}

/**
 * The one provider an app mounts at its root: the active breakpoint for responsive `sx`, the theme for every
 * token — with the app's overrides — and the platform appearance override that keeps both rendering tiers on the
 * same variant.
 */
export const KaraProvider = ({children, theme, themePreference = 'system'}: KaraProviderProps) => {
  const colorScheme = useColorScheme()

  useAppearanceOverride(themePreference)

  const variant = useMemo(() => variantFor(themePreference, colorScheme), [colorScheme, themePreference])

  return (
    <BreakpointProvider>
      <AppThemeProvider config={theme} variant={variant}>
        {children}
      </AppThemeProvider>
    </BreakpointProvider>
  )
}
