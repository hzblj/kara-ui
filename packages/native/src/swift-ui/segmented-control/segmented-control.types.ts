import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type SegmentedControlOption = {
  /** An image URL (PNG, SVG…) shown instead of the label, at 20 pt high in its own colours. */
  icon?: string
  /** The segment's text, and its accessibility label when it has an `icon`. */
  label: string
  value: string
}

export type SegmentedControlProps = {
  activePillColor: ColorValue
  activeTextColor: ColorValue
  /** The track's corner radius, in points. UIKit's own rounded track when unset. */
  cornerRadius?: number
  disabled?: boolean
  /** A font face the app registered. The system face, medium, when unset. */
  fontFamily?: string
  /** In points, not scaled with Dynamic Type: the control keeps UIKit's height. */
  fontSize?: number
  inactiveTextColor: ColorValue
  /** The tapped segment's `value`. The pill moves at once and goes back unless `selectedValue` follows. */
  onValueChange: (value: string) => void
  options: SegmentedControlOption[]
  /** The selected pill's corner radius, in points (best effort; see the view). The system pill when unset. */
  pillCornerRadius?: number
  /** Controlled: the `value` of the selected option. */
  selectedValue: string
  /** The width comes from layout; the height is the control's own. */
  style?: StyleProp<ViewStyle>
  testID?: string
  trackColor?: ColorValue
}
