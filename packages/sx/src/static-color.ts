import {resolveSystemColor} from '@hzblj/kara-native'

type DynamicBranches = {dark?: unknown; light?: unknown}

/**
 * A resolved colour as a value a Reanimated transition can interpolate: a hex or a number stays itself, a
 * `DynamicColorIOS` gives up the branch for this appearance, and a `PlatformColor` is asked of UIKit. `undefined` where
 * none of that works, which leaves the colour to change without a transition rather than throw on the UI thread.
 *
 * iOS only in practice: Android's resolver hands every token back as a hex already. The high-contrast branches are not
 * followed; a transitioned colour lands on the appearance's own value.
 */
export const staticColor = (value: unknown, dark: boolean): number | string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (typeof value !== 'object' || value === null) {
    return undefined
  }

  if ('semantic' in value && Array.isArray(value.semantic)) {
    return resolveSystemColor(value.semantic as string[], dark)
  }

  if ('dynamic' in value && typeof value.dynamic === 'object' && value.dynamic !== null) {
    const branches = value.dynamic as DynamicBranches

    return staticColor(dark ? branches.dark : branches.light, dark)
  }

  return undefined
}
