import {KaraProvider, useAppTheme} from '@hzblj/kara-ui'
import {navigationTheme} from '@hzblj/kara-ui/router'
import {ThemeProvider} from 'expo-router'
import {type ReactNode, useMemo} from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import {ACCENTS, AppearanceProvider, useAppearance} from './appearance'

const ROOT_STYLE = {flex: 1}

/**
 * Sits *inside* `KaraProvider` so it maps the same `Theme` everything else sees — the system half of the palette is
 * resolved there, and a navigation theme built outside it would have nothing to resolve a system token into.
 */
const NavigationTheme = ({children}: {children: ReactNode}) => {
  const theme = useAppTheme()
  const value = useMemo(() => navigationTheme(theme), [theme])

  return <ThemeProvider value={value}>{children}</ThemeProvider>
}

/** The accent themes are module-level constants, so switching one hands `KaraProvider` a stable config. */
const Kara = ({children}: {children: ReactNode}) => {
  const {accent, preference} = useAppearance()

  return (
    <KaraProvider theme={ACCENTS[accent]} themePreference={preference}>
      <NavigationTheme>{children}</NavigationTheme>
    </KaraProvider>
  )
}

export const Providers = ({children}: {children: ReactNode}) => (
  <GestureHandlerRootView style={ROOT_STYLE}>
    <AppearanceProvider>
      <Kara>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </Kara>
    </AppearanceProvider>
  </GestureHandlerRootView>
)
