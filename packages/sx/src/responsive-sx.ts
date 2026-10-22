import type {ResponsiveOf} from './responsive.types'
import type {Sx, SxCore} from './sx.types'
import type {ViewSx} from './view-sx.types'

/**
 * Layout keys only, and deliberately so: a wider screen wants a different gap, padding or column
 * count — not a different colour. `bg`, `shadow`, the radii, `opacity`, the transforms and both
 * platform buckets therefore stay scalar.
 *
 * `Partial` because this is a subset by design; what the `satisfies` buys is the other direction — a
 * key renamed in `SxCore` stops compiling here instead of silently going non-responsive.
 */
const SX_RESPONSIVE_KEY_RECORD = {
  h: true,
  minH: true,
  minW: true,
  p: true,
  pb: true,
  pl: true,
  pr: true,
  pt: true,
  px: true,
  py: true,
  tall: true,
  w: true,
  wide: true,
} as const satisfies Partial<Record<keyof SxCore, true>>

export type ResponsiveSxKey = keyof typeof SX_RESPONSIVE_KEY_RECORD

/** What `useSxModifiers` flattens before the SwiftUI and Compose paths see it. */
export const SX_RESPONSIVE_KEYS = Object.keys(SX_RESPONSIVE_KEY_RECORD) as readonly ResponsiveSxKey[]

/** The core keys plus what only the React Native style path has: margins, gaps, flex, sizing maxima. */
const VIEW_RESPONSIVE_KEY_RECORD = {
  ...SX_RESPONSIVE_KEY_RECORD,
  align: true,
  alignContent: true,
  alignSelf: true,
  basis: true,
  columnGap: true,
  display: true,
  flex: true,
  flexDirection: true,
  gap: true,
  grow: true,
  justify: true,
  m: true,
  maxH: true,
  maxW: true,
  mb: true,
  ml: true,
  mr: true,
  mt: true,
  mx: true,
  my: true,
  rowGap: true,
  shrink: true,
  wrap: true,
} as const satisfies Partial<Record<keyof ViewSx, true>>

export type ResponsiveViewSxKey = keyof typeof VIEW_RESPONSIVE_KEY_RECORD

/** What `useSx` flattens before the style cache sees it. */
export const VIEW_RESPONSIVE_KEYS = Object.keys(VIEW_RESPONSIVE_KEY_RECORD) as readonly ResponsiveViewSxKey[]

/**
 * The native modifier surface as a component takes it — `Sx` is the same surface once a breakpoint
 * has been picked, which is what every resolver and cache downstream of `flattenSx` works with.
 */
export type ResponsiveSx = ResponsiveOf<Sx, ResponsiveSxKey>

/** `ViewSx` as a component takes it, standing to it as `ResponsiveSx` does to `Sx`. */
export type ResponsiveViewSx = ResponsiveOf<ViewSx, ResponsiveViewSxKey>
