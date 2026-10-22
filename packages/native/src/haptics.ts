import {requireOptionalNativeModule} from 'expo'
import {Platform} from 'react-native'

import {KARA_UI_MODULE} from './require-view'

/**
 * Every haptic the KaraUI module plays, named for what happened rather than how it feels. `ios/Haptics/Haptics.swift`
 * and `android/…/haptics/Haptics.kt` accept exactly these and map each to the platform's own feedback.
 */
export const HAPTICS = [
  'selection',
  'tick',
  'soft',
  'light',
  'medium',
  'rigid',
  'heavy',
  'success',
  'warning',
  'error',
  'toggleOn',
  'toggleOff',
  'longPress',
  'dragStart',
  'thresholdActivate',
  'thresholdDeactivate',
  'keyPress',
] as const

export type Haptic = (typeof HAPTICS)[number]

// Optional members: a JS bundle newer than the native build it runs on (an OTA update) finds the module without them.
type HapticsModule = {
  playHaptic?: (haptic: Haptic, intensity: number | null) => void
  prepareHaptic?: (haptic: Haptic) => void
}

let hapticsModule: HapticsModule | null | undefined

const nativeHaptics = (): HapticsModule | null => {
  if (hapticsModule === undefined) {
    hapticsModule = requireOptionalNativeModule<HapticsModule>(KARA_UI_MODULE)
  }

  return hapticsModule
}

/**
 * Plays `haptic` at once — synchronous, nothing to await. `intensity` (0–1) scales an iOS impact. Silent where the
 * build does not link the KaraUI module, or links one from before haptics (and under Jest).
 */
export const playHaptic = (haptic: Haptic, intensity?: number): void => {
  nativeHaptics()?.playHaptic?.(haptic, intensity ?? null)
}

/** iOS: readies the Taptic Engine to play `haptic` within the next few seconds. Android has nothing to warm up. */
export const prepareHaptic = (haptic: Haptic): void => {
  if (Platform.OS === 'ios') {
    nativeHaptics()?.prepareHaptic?.(haptic)
  }
}
