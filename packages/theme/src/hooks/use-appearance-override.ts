import {useEffect} from 'react'
import {Appearance} from 'react-native'
import type {ThemePreference} from '../theme.types'

/**
 * Pushes a theme preference down to the platform as a real appearance override, not just into React state.
 *
 * The palette resolves its neutrals through system colours, and the platform evaluates those itself — so
 * without this the app splits brain under an in-app override: `@expo/ui`'s host overrides only the SwiftUI
 * environment, leaving every `PlatformColor` in the React Native tier still resolving against the OS. Setting
 * it here covers both tiers at once: on iOS it assigns `overrideUserInterfaceStyle` to the app's windows, on
 * Android the default night mode.
 *
 * `'system'` maps to `'unspecified'`, which hands the decision back to the OS.
 */
export const useAppearanceOverride = (preference: ThemePreference): void => {
  useEffect(() => {
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference)
  }, [preference])
}
