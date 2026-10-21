import {requireOptionalNativeModule} from 'expo'
import {Platform} from 'react-native'

import {KARA_UI_MODULE} from './require-view'

type KaraUIModule = {isScrollEdgeEffectAvailable: () => boolean}

let scrollEdgeEffect: boolean | undefined

/**
 * Whether the OS has the iOS 26 scroll edge effect. Always `false` on Android, and `false` in a build that does not
 * link the KaraUI module yet — the components that ask fall back to drawing their own chrome. Asked of the native side
 * once: the OS cannot change under a running app.
 */
export const isScrollEdgeEffectAvailable = (): boolean => {
  scrollEdgeEffect ??=
    Platform.OS === 'ios' &&
    (requireOptionalNativeModule<KaraUIModule>(KARA_UI_MODULE)?.isScrollEdgeEffectAvailable() ?? false)

  return scrollEdgeEffect
}

/** Liquid Glass shipped in the same iOS release as the scroll edge effect, so it is the same check. */
export const isLiquidGlassAvailable = isScrollEdgeEffectAvailable
