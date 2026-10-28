import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type SegmentedControlOption = {
  /** An asset-catalog image (the app's icon), drawn before the label in the label's colour. */
  icon?: string
  /** An image by URL or bundle name, raster or SVG, drawn in its own colours instead of the label. */
  image?: string
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
  /** The system face's weight (`'400'`, `'500'`…) when no `fontFamily` is set. Medium when unset. */
  fontWeight?: string
  /** The height of a segment's icon or image, in points. 20 when unset. */
  iconSize?: number
  inactiveTextColor: ColorValue
  /** Extra space between the label's letters, in points. The face's own when unset. */
  letterSpacing?: number
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
  /**
   * The track, drawn by kara in exactly this colour under a clear control (UIKit would render it translucent), a
   * capsule unless `cornerRadius` says otherwise. UIKit's own track when unset.
   */
  trackColor?: ColorValue
  /** Space between `trackColor`'s track and the selected pill, in points; the track grows by it. UIKit's 2 when unset. */
  trackPadding?: number
  /** Space above and below a segment's content, in points, which makes the control taller. UIKit's height when unset. */
  verticalPadding?: number
}
