import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

export type IconViewProps = {
  accessibilityLabel?: string
  /** An image in the app's asset catalog — what the config plugin names an app icon (`kara_icon_*`). */
  assetName?: string
  iconColor?: ColorValue
  style?: StyleProp<ViewStyle>
  /** The point size a `systemName` symbol is drawn at, as `Image(systemName:)` sizes it. */
  symbolSize?: number
  /** An SF Symbol — wins over `assetName`. */
  systemName?: string
  testID?: string
}

/** A UIKit icon for the React Native tier: an asset-catalog template image or an SF Symbol, tinted. No host needed. */
export const IconView = requireKaraView<IconViewProps>('IconView')
