import {isDynamicColorAvailable} from '@expo/ui/jetpack-compose'

import type {IsDynamicColorSupported} from './dynamic-color.types'

/** The same check `@expo/ui`'s `<Host>` makes before it reaches for the wallpaper scheme: Android 12 (API 31) or newer. */
export const isDynamicColorSupported: IsDynamicColorSupported = () => isDynamicColorAvailable
