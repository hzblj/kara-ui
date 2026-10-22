import {HAPTICS, type Haptic, playHaptic, prepareHaptic} from '@hzblj/kara-native'

export type {Haptic}

export type HapticOptions = {
  /** iOS: scales an impact — `soft`, `light`, `medium`, `rigid`, `heavy` — from 0 to 1. Everything else ignores it. */
  intensity?: number
}

type HapticShorthands = {readonly [K in Haptic]: (options?: HapticOptions) => void}

let enabled = true

const play = (haptic: Haptic, options?: HapticOptions): void => {
  if (enabled) {
    playHaptic(haptic, options?.intensity)
  }
}

const prepare = (haptic: Haptic): void => {
  if (enabled) {
    prepareHaptic(haptic)
  }
}

const shorthands = Object.fromEntries(
  HAPTICS.map(haptic => [haptic, (options?: HapticOptions) => play(haptic, options)])
) as HapticShorthands

/**
 * The platform's own haptic feedback, named for what happened: UIKit's feedback generators on iOS, the system's
 * `HapticFeedbackConstants` on Android — never a raw vibration. Both follow the user's system haptics setting, and
 * every call is synchronous, with nothing to await.
 *
 * ```ts
 * haptics.success()                    // a name you know: one function per haptic
 * haptics.play(haptic)                 // a name that arrives as data
 * haptics.light({intensity: 0.6})      // impacts scale on iOS
 * haptics.prepare('selection')         // iOS: warm the Taptic Engine as a gesture begins
 * haptics.setEnabled(userPreference)   // silences every kara haptic, the components' own too
 * ```
 *
 * - `selection` — a choice changed: a segment, a chip, a picker row.
 * - `tick` — one step of a continuous gesture: a slider detent, a scrubbed value.
 * - `toggleOn` / `toggleOff` — a switch flipped.
 * - `success` / `warning` / `error` — how a task ended. Android has no warning of its own; it plays a rejection.
 * - `longPress` / `dragStart` — a long press was recognised; an item lifted to be dragged.
 * - `thresholdActivate` / `thresholdDeactivate` — a gesture crossed its commit point, or went back over it.
 * - `keyPress` — a key of the app's own keypad.
 * - `soft`, `light`, `medium`, `rigid`, `heavy` — a collision none of the names above describes.
 *
 * On Android the names that came with Android 14's constants fall back to the nearest older feedback, so every name
 * plays on every version. Haptics are silent in a build without kara's native module.
 */
export const haptics = {
  ...shorthands,
  /** Whether kara plays haptics — `true` until `setEnabled(false)`. */
  isEnabled: (): boolean => enabled,
  play,
  prepare,
  /**
   * Switches every kara haptic on or off, the ones its components play included — for an app's own "Haptics" setting.
   * Not persisted: call it at start-up with the stored preference. The system setting applies either way.
   */
  setEnabled: (value: boolean): void => {
    enabled = value
  },
}
