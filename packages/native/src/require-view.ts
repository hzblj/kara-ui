import {requireNativeView} from 'expo'
import type {ComponentType} from 'react'

/** The Expo module every view and function in `ios/` and `android/` registers under. */
export const KARA_UI_MODULE = 'KaraUI'

/**
 * A view from the KaraUI module. Safe to call at module scope on either platform: React Native registers the view
 * config lazily, so a view only one platform implements fails when it is rendered there — never when the file that
 * names it is imported.
 */
export const requireKaraView = <TProps>(viewName: string): ComponentType<TProps> =>
  requireNativeView<TProps>(KARA_UI_MODULE, viewName)
