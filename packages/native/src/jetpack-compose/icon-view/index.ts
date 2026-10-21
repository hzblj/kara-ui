import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

export type IconViewProps = {
  accessibilityLabel?: string
  iconColor?: ColorValue
  /** A vector drawable resource — `kara_icon_*` (the app's icons) or `kara_glyph_*` (kara's own). */
  resourceName: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** An Android `ImageView` over a vector drawable, for the React Native tier. No host needed. */
export const IconView = requireKaraView<IconViewProps>('IconView')
