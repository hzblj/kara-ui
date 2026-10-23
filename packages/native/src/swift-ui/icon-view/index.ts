import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'

export type IconViewProps = {
  accessibilityLabel?: string
  iconColor?: ColorValue
  style?: StyleProp<ViewStyle>
  /** The point size a `systemName` symbol is drawn at, as `Image(systemName:)` sizes it. */
  symbolSize?: number
  /** The SF Symbol to draw. */
  systemName?: string
  testID?: string
}

/** A kara glyph for the React Native tier: an SF Symbol in a `UIImageView`, tinted. No host needed. */
export const IconView = requireKaraView<IconViewProps>('IconView')
