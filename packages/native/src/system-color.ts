import {requireOptionalNativeModule} from 'expo'
import {Platform} from 'react-native'

import {KARA_UI_MODULE} from './require-view'

// Optional: a JS bundle newer than the native build it runs on finds the module without it.
type SystemColorModule = {resolveSystemColor?: (names: string[], dark: boolean) => string | null}

let systemColorModule: SystemColorModule | null | undefined

const resolved = new Map<string, string | undefined>()

/**
 * A UIKit semantic colour (what `PlatformColor('labelColor')` names) as the `#rrggbbaa` it draws in one appearance, for
 * what has to interpolate a colour itself: a Reanimated transition reads numbers, never a handle UIKit resolves. Asked of
 * the native side once per name and appearance. `undefined` on Android, for a name UIKit does not know, and in a build
 * that does not link it yet.
 */
export const resolveSystemColor = (names: readonly string[], dark: boolean): string | undefined => {
  if (Platform.OS !== 'ios') {
    return undefined
  }

  const key = `${dark ? 'd' : 'l'}${names.join(',')}`

  if (resolved.has(key)) {
    return resolved.get(key)
  }

  systemColorModule ??= requireOptionalNativeModule<SystemColorModule>(KARA_UI_MODULE)

  const hex = systemColorModule?.resolveSystemColor?.([...names], dark) ?? undefined
  resolved.set(key, hex)

  return hex
}
