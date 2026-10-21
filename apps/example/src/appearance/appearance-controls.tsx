import {SegmentedControl, type ThemePreference} from '@hzblj/kara-ui'

import {ACCENT_LABELS, ACCENT_ORDER} from './accents'
import {useAppearance} from './appearance'

const PREFERENCES = ['system', 'light', 'dark'] as const satisfies readonly ThemePreference[]

const PREFERENCE_LABELS = ['System', 'Light', 'Dark']

export const ThemePreferenceControl = ({testID}: {testID?: string}) => {
  const {preference, setPreference} = useAppearance()

  const select = (index: number) => {
    const next = PREFERENCES[index]

    if (next) {
      setPreference(next)
    }
  }

  return (
    <SegmentedControl
      onChange={select}
      selectedIndex={PREFERENCES.indexOf(preference)}
      testID={testID}
      values={PREFERENCE_LABELS}
    />
  )
}

export const AccentControl = ({testID}: {testID?: string}) => {
  const {accent, setAccent} = useAppearance()

  const select = (index: number) => {
    const next = ACCENT_ORDER[index]

    if (next) {
      setAccent(next)
    }
  }

  return (
    <SegmentedControl
      onChange={select}
      selectedIndex={ACCENT_ORDER.indexOf(accent)}
      testID={testID}
      values={ACCENT_LABELS}
    />
  )
}
