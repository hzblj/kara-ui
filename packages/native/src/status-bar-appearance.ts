import {requireOptionalNativeModule} from 'expo'
import {Platform} from 'react-native'

import {KARA_UI_MODULE} from './require-view'

type KaraUIModule = {isViewControllerBasedStatusBarAppearance: () => boolean}

let viewControllerBased: boolean | undefined

/**
 * Whether iOS takes the status bar style from each screen's view controller (`UIViewControllerBasedStatusBarAppearance`
 * on, or absent from Info.plist), which is what a native stack's per-screen `statusBarStyle` needs, or from the app,
 * which React Native's `StatusBar` (and `expo-status-bar`, Expo's default) needs. `false` on Android and in a build
 * without the KaraUI module. Read once: Info.plist cannot change under a running app.
 */
export const isViewControllerBasedStatusBarAppearance = (): boolean => {
  viewControllerBased ??=
    Platform.OS === 'ios' &&
    (requireOptionalNativeModule<KaraUIModule>(KARA_UI_MODULE)?.isViewControllerBasedStatusBarAppearance() ?? false)

  return viewControllerBased
}
