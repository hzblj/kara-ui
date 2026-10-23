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

/** Per-side widths draw only the edges you name: a one-sided hairline divider needs just one. */
type ViewBorderSx = {
  borderBottomWidth?: number
  borderLeftWidth?: number
  borderRightWidth?: number
  borderStyle?: ViewStyle['borderStyle']
  borderTopWidth?: number
}

/** `minW`/`minH` live in `StyleSx`: every target can express those, so they are not view-only. */
type ViewSizingSx = {
  aspectRatio?: number
  maxH?: SxDimension
  maxW?: SxDimension
  /** Width and height at once: `size={48}` is a 48 pt square. `w` and `h` win over it. */
  size?: SxDimension
}

/**
 * `grow` is deliberately React Native only. Compose's `weight` is the same proportional share of the
 * leftover space, but SwiftUI has no per-child weight at all; its nearest move is an infinite `maxWidth`,
 * which splits the space equally and ignores the ratio. So the modifier paths expose it as
 * `android={{weight}}` and `ios={{layoutPriority}}`, which is what each of them actually does.
 */
type ViewFlexSx = {
  align?: ViewStyle['alignItems']
  alignContent?: ViewStyle['alignContent']
  alignSelf?: ViewStyle['alignSelf']
  basis?: SxDimension
  /** Centres the children on both axes. `align` and `justify` win over it. */
  center?: boolean
  columnGap?: SpaceSize
  /** Takes the room left along its parent's axis: `flex: 1`. `flex` wins over it. */
  fill?: boolean
  flex?: number
  flexDirection?: ViewStyle['flexDirection']
  gap?: SpaceSize
  /** A share of the leftover space; `true` is 1. */
  grow?: boolean | number
  justify?: ViewStyle['justifyContent']
  /** Lays the children out in a row rather than a column. `flexDirection` wins over it. */
  row?: boolean
  rowGap?: SpaceSize
  /** How much it gives up when the room runs short; `true` is 1. */
  shrink?: boolean | number
  /** Lets the children wrap onto further lines; `true` is `wrap`. */
  wrap?: boolean | ViewStyle['flexWrap']
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
  /**
   * Out of the flow and over its parent, all four edges at 0: what an overlay, a scrim or a backdrop wants. A side of
   * its own (`top`, `inset`…) wins, and so does `position`.
   */
  absolute?: boolean
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
