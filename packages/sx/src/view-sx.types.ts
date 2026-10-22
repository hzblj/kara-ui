import type {RadiiSize, SpaceSize} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'

import type {StyleSx, SxDimension} from './sx.types'

/**
 * Corner radii cascade the way padding does: a single corner beats its edge pair,
 * which beats `borderRadius`. So `borderRadius="medium" borderBottomRadius="none"`
 * rounds the top two corners only.
 *
 * Exported so `CORNER_KEYS` can be held to exactly these keys.
 */
export type ViewRadiiSx = {
  borderBottomLeftRadius?: RadiiSize
  borderBottomRadius?: RadiiSize
  borderBottomRightRadius?: RadiiSize
  borderLeftRadius?: RadiiSize
  borderRightRadius?: RadiiSize
  borderTopLeftRadius?: RadiiSize
  borderTopRadius?: RadiiSize
  borderTopRightRadius?: RadiiSize
}

/** Per-side widths draw only the edges you name — a one-sided hairline divider needs just one. */
type ViewBorderSx = {
  borderBottomWidth?: number
  borderLeftWidth?: number
  borderRightWidth?: number
  borderStyle?: ViewStyle['borderStyle']
  borderTopWidth?: number
}

/** `minW`/`minH` live in `StyleSx` — every target can express those, so they are not view-only. */
type ViewSizingSx = {
  aspectRatio?: number
  maxH?: SxDimension
  maxW?: SxDimension
}

/**
 * `grow` is deliberately React Native only. Compose's `weight` is the same proportional share of the
 * leftover space, but SwiftUI has no per-child weight at all — its nearest move is an infinite `maxWidth`,
 * which splits the space equally and ignores the ratio. So the modifier paths expose it as
 * `android={{weight}}` and `ios={{layoutPriority}}`, which is what each of them actually does.
 */
type ViewFlexSx = {
  align?: ViewStyle['alignItems']
  alignContent?: ViewStyle['alignContent']
  alignSelf?: ViewStyle['alignSelf']
  basis?: SxDimension
  columnGap?: SpaceSize
  flex?: number
  flexDirection?: ViewStyle['flexDirection']
  gap?: SpaceSize
  grow?: number
  justify?: ViewStyle['justifyContent']
  rowGap?: SpaceSize
  shrink?: number
  wrap?: ViewStyle['flexWrap']
}

/** Margins mirror the padding scale: `m` all round, `mx`/`my` per axis, `mt`/`mr`/`mb`/`ml` per side. */
type ViewMarginSx = {
  m?: SpaceSize
  mb?: SpaceSize
  ml?: SpaceSize
  mr?: SpaceSize
  mt?: SpaceSize
  mx?: SpaceSize
  my?: SpaceSize
}

type ViewLayoutSx = {
  bottom?: SxDimension
  display?: ViewStyle['display']
  /** All four edges at once, so `position="absolute" inset={0}` fills the parent. A side of its own wins over it. */
  inset?: SxDimension
  left?: SxDimension
  overflow?: ViewStyle['overflow']
  position?: ViewStyle['position']
  right?: SxDimension
  top?: SxDimension
}

/**
 * The widest `sx` surface: everything a React Native view can be styled with. `Sx` is the subset the
 * SwiftUI and Compose modifier paths can also express, so only this one reaches the RN style engine.
 */
export type ViewSx = StyleSx & ViewBorderSx & ViewFlexSx & ViewLayoutSx & ViewMarginSx & ViewRadiiSx & ViewSizingSx
