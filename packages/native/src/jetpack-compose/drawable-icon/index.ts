import type {ColorValue} from 'react-native'

import {requireKaraView} from '../../require-view'

export type DrawableIconProps = {
  accessibilityLabel?: string
  /** Unset takes the surrounding `LocalContentColor` — the content colour of the button or bar it sits in. */
  iconColor?: ColorValue
  /** In dp. Unset keeps the drawable's own 24 dp. */
  iconSize?: number
  /** A vector drawable resource — `native_icon_*` (the app's icons, `@hzblj/expo-native-icons`) or `kara_glyph_*` (kara's own). */
  resourceName: string
}

/** Material's `Icon` over a vector drawable, inside a Compose host. */
export const DrawableIcon = requireKaraView<DrawableIconProps>('DrawableIconView')
