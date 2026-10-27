import {Image, type ImageSourcePropType} from 'react-native'

import type {SegmentedControlSegment} from './segmented-control.types'

/** A plain label is a segment with nothing else. */
export const segmentOf = (value: string | SegmentedControlSegment): SegmentedControlSegment =>
  typeof value === 'string' ? {label: value} : value

/** What the native loaders take: a `require()`d file's packager or file URL, or the URI itself. */
export const imageUri = (source: ImageSourcePropType | undefined): string | undefined => {
  if (source === undefined) {
    return undefined
  }

  return Image.resolveAssetSource(Array.isArray(source) ? source[0] : source)?.uri
}
