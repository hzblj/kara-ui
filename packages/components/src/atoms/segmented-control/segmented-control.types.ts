import type {ColorToken, SpaceSize, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import type {ImageSourcePropType} from 'react-native'

import type {IconName} from '../icon'

/** A segment that shows more than its label. */
export type SegmentedControlSegment = {
  /** One of the app's icons, before the label and in the label's colour, the selected segment's or the others'. */
  icon?: IconName
  /**
   * An image in its own colours instead of the label, such as a carrier's logo: a `require()`d file, or `{uri}` for a
   * URL (raster or SVG). The label stays what screen readers say, and is shown instead if the image cannot be loaded.
   */
  image?: ImageSourcePropType
  /** What the segment says, and what `onChange` reports. */
  label: string
}

/**
 * A row of mutually exclusive segments, the selected one in the accent: kara's own `UISegmentedControl` on iOS,
 * Material's single-choice segmented buttons on Android. It needs no `Screen` or `Island`: iOS is a plain view, Android
 * brings its own host. Inside one it joins that host, so it can share a stack with other native views. It takes the
 * width it is given; the height is the platform's, or taller with `spacing`. A segment can lead with one of the app's
 * icons or be an image, a logo, both loaded natively (SDWebImage on iOS, androidsvg on Android, as Footshop does).
 * The track takes the `sx` names a component sized by props uses: `bg` for its colour, `p` for the room around the
 * pill, and `variant` sets the labels like `Text`.
 */
export type SegmentedControlProps = {
  /**
   * The track's colour, a palette token. iOS draws it itself as a capsule under the control, in exactly this colour
   * (UIKit renders a control's own background translucent); Android fills the unselected segments with it. The
   * platform's own track when unset.
   */
  bg?: ColorToken
  /** Stops the user changing the segment, and dims the control. */
  disabled?: boolean
  /** The height of the segments' icons and images, a spacing token. `s20` by default. */
  iconSize?: SpaceSize
  /**
   * Called with the index and label of the segment the user picked, never for a tap on the one already selected.
   * Android plays `selection`; iOS's control plays its own feedback.
   */
  onChange?: (index: number, value: string) => void
  /**
   * Room between the track's edge and the selected pill, a spacing token, with `bg`: the track grows by it and the pill
   * keeps its height. iOS only, UIKit's own `s2` when unset; Material's segments have no pill to inset.
   */
  p?: SpaceSize
  /** The selected segment. Controlled: pass back what `onChange` reports. */
  selectedIndex: number
  /**
   * Space above and below the segments' content, a spacing token: a taller control, for bigger icons or an easier
   * target. Unset keeps the platform's own height, and the control is never shorter than that.
   */
  spacing?: SpaceSize
  /** Test identifier, on the whole control. Reach a segment by its label. */
  testID?: string
  /** The segments, in order: a label, or a segment with an icon or an image. */
  values: (string | SegmentedControlSegment)[]
  /**
   * The labels' typography variant, the app's face if it has one. `footnoteMedium` on iOS and `subheadlineMedium` on
   * Android by default, each platform's own segmented size. Not scaled with Dynamic Type on iOS.
   */
  variant?: TextVariant
}

export type SegmentedControlComponent = (props: SegmentedControlProps) => ReactNode
