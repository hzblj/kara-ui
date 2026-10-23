import {type NativeIconsPluginOptions, withNativeIcons} from '@hzblj/expo-native-icons/plugin'
import {type ConfigPlugin, createRunOncePlugin} from 'expo/config-plugins'

import {type IosSemanticColorsProps, withIosSemanticColors} from './ios-semantic-colors'

export type {IosColorAppearances, IosSemanticColorsProps} from './ios-semantic-colors'

export type KaraUIPluginProps = {
  /**
   * The app's icons: a folder of SVGs turned into native assets on both platforms, and their names into types.
   * `@hzblj/expo-native-icons` does the work; see its options.
   */
  icons?: NativeIconsPluginOptions
  /** Redefines UIKit semantic colours app-wide, natively. See `withIosSemanticColors`. */
  iosSemanticColors?: IosSemanticColorsProps
}

/**
 * `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]` in the app config. Everything native the
 * library cannot ship itself: the app's own icons as native assets (`@hzblj/expo-native-icons`), and optionally what a
 * UIKit semantic colour itself resolves to, for every token (and every piece of UIKit) that names it.
 */
const withKaraUI: ConfigPlugin<KaraUIPluginProps | undefined> = (config, {icons, iosSemanticColors} = {}) => {
  const withColors = iosSemanticColors ? withIosSemanticColors(config, iosSemanticColors) : config

  return icons ? withNativeIcons(withColors, icons) : withColors
}

// Read at prebuild from the shipped package.json, beside `build/`: outside `rootDir`, so not an import.
const pkg: {name: string; version: string} = require('../package.json')

export default createRunOncePlugin(withKaraUI, pkg.name, pkg.version)
