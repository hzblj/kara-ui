import {requireOptionalNativeModule} from 'expo'
import {type ColorValue, Platform} from 'react-native'

import {KARA_UI_MODULE} from './require-view'

/** A colour for both appearances (a `PlatformColor` or `DynamicColorIOS` follows it by itself), or one each. */
export type SwipeActionColor = {dark?: ColorValue; light: ColorValue}

export type SwipeActionAppearance = {
  /** The capsule colour that marks an action as destructive, so it takes `destructiveIconColor`. */
  destructiveBackgroundColor?: SwipeActionColor
  /** The icon on a destructive action's capsule. */
  destructiveIconColor?: SwipeActionColor
  /** The icon on every other action's capsule. */
  iconColor?: SwipeActionColor
  /** The title under the capsule. */
  titleColor?: SwipeActionColor
}

type KaraUIModule = {configureSwipeActionAppearance: (appearance: SwipeActionAppearance) => void}

/**
 * Colours every list swipe action from now on, which SwiftUI has no API for: on iOS 26 the title under each capsule
 * and the icon on it. A colour left out keeps the system's. Nothing on Android or below iOS 26.
 */
export const configureSwipeActionAppearance = (appearance: SwipeActionAppearance) => {
  if (Platform.OS !== 'ios') {
    return
  }

  requireOptionalNativeModule<KaraUIModule>(KARA_UI_MODULE)?.configureSwipeActionAppearance(appearance)
}
