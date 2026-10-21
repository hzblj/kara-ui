import {type ConfigPlugin, createRunOncePlugin} from 'expo/config-plugins'

import {type IosSemanticColorsProps, withIosSemanticColors} from './ios-semantic-colors'

export type {IosColorAppearances, IosSemanticColorsProps} from './ios-semantic-colors'

export type KaraUIPluginProps = {
  /** Redefines UIKit semantic colours app-wide, natively. See `withIosSemanticColors`. */
  iosSemanticColors?: IosSemanticColorsProps
}

/**
 * `plugins: [['@hzblj/kara-ui', {iosSemanticColors: {file: './ios-colors.json'}}]]` in the app config. Optional — the
 * library needs no native configuration to run. It exists for the one override the theme cannot make from JS: what a
 * UIKit semantic colour itself resolves to, for every token (and every piece of UIKit) that names it.
 */
const withKaraUI: ConfigPlugin<KaraUIPluginProps | undefined> = (config, {iosSemanticColors} = {}) =>
  iosSemanticColors ? withIosSemanticColors(config, iosSemanticColors) : config

// Read at prebuild from the shipped package.json, beside `build/` — outside `rootDir`, so not an import.
const pkg: {name: string; version: string} = require('../package.json')

export default createRunOncePlugin(withKaraUI, pkg.name, pkg.version)
