import type {ThemePreference} from '@hzblj/kara-ui'
import {createContext, type ReactNode, useContext, useMemo, useState} from 'react'

import type {Accent} from './accents'

type AppearanceState = {
  accent: Accent
  preference: ThemePreference
  setAccent: (accent: Accent) => void
  setPreference: (preference: ThemePreference) => void
}

const AppearanceContext = createContext<AppearanceState | null>(null)

/**
 * The example's one piece of app state: which appearance and which accent the user picked. A real app would persist
 * them; here they live for the session, which is all the screens and Storybook's frame need.
 */
export const AppearanceProvider = ({children}: {children: ReactNode}) => {
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [accent, setAccent] = useState<Accent>('default')
  const value = useMemo(() => ({accent, preference, setAccent, setPreference}), [accent, preference])

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export const useAppearance = (): AppearanceState => {
  const state = useContext(AppearanceContext)

  if (!state) {
    throw new Error('useAppearance must be used inside AppearanceProvider.')
  }

  return state
}
