import type {SpaceSize} from '@hzblj/kara-theme'
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
 */
export type SegmentedControlProps = {
  /** Stops the user changing the segment, and dims the control. */
  disabled?: boolean
  /** The height of the segments' icons and images, a spacing token. `s20` by default. */
  iconSize?: SpaceSize
  /**
   * Called with the index and label of the segment the user picked, never for a tap on the one already selected.
   * Android plays `selection`; iOS's control plays its own feedback.
   */
  onChange?: (index: number, value: string) => void
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
}

export type SegmentedControlComponent = (props: SegmentedControlProps) => ReactNode
