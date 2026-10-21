import {radii, spacing, type Theme} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'

import {createSxCache} from './resolve-cache'
import type {ResponsiveViewSx} from './responsive-sx'
import type {StyleSx} from './sx.types'
import {SX_CORE_KEYS} from './sx-keys'
import {sxToStyle} from './sx-to-style'
import type {ViewRadiiSx, ViewSx} from './view-sx.types'

/**
 * `Record`s rather than bare arrays, for the same reason as `SX_CORE_KEY_RECORD`: `satisfies` on an
 * array only checks membership, while these refuse to compile when a key is added to `ViewSx` but
 * missing here — which `split` would then leak into the wrapped component's own props.
 */
const CORNER_KEY_RECORD = {
  borderBottomLeftRadius: true,
  borderBottomRadius: true,
  borderBottomRightRadius: true,
  borderLeftRadius: true,
  borderRightRadius: true,
  borderTopLeftRadius: true,
  borderTopRadius: true,
  borderTopRightRadius: true,
} as const satisfies Record<keyof ViewRadiiSx, true>

const CORNER_KEYS = Object.keys(CORNER_KEY_RECORD) as readonly (keyof ViewRadiiSx)[]

type ViewOnlyKey = Exclude<keyof ViewSx, keyof StyleSx>

const VIEW_ONLY_KEY_RECORD = {
  ...CORNER_KEY_RECORD,
  align: true,
  alignContent: true,
  alignSelf: true,
  aspectRatio: true,
  basis: true,
  borderBottomWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderStyle: true,
  borderTopWidth: true,
  bottom: true,
  columnGap: true,
  display: true,
  flex: true,
  flexDirection: true,
  gap: true,
  grow: true,
  justify: true,
  left: true,
  m: true,
  maxH: true,
  maxW: true,
  mb: true,
  ml: true,
  mr: true,
  mt: true,
  mx: true,
  my: true,
  overflow: true,
  position: true,
  right: true,
  rowGap: true,
  shrink: true,
  top: true,
  wrap: true,
} as const satisfies Record<ViewOnlyKey, true>

const VIEW_ONLY_KEYS = Object.keys(VIEW_ONLY_KEY_RECORD) as readonly ViewOnlyKey[]

/**
 * Every key the RN style engine owns — what `sx()` and `useSx` split off a component's props. Built
 * from `SX_CORE_KEYS` rather than `SX_KEYS` on purpose: including the `ios`/`android` buckets would
 * have `Box` strip them off its props and drop them, since a React Native style has nothing to
 * resolve them into.
 */
export const VIEW_SX_KEYS: readonly (keyof ViewSx & string)[] = [...SX_CORE_KEYS, ...VIEW_ONLY_KEYS]

type SpaceKey = NonNullable<ViewSx['m']>

type RadiiToken = NonNullable<ViewSx['borderRadius']>

const space = (token: SpaceKey | undefined) => (token === undefined ? undefined : spacing[token])

const radius = (token: RadiiToken | undefined) => (token === undefined ? undefined : radii[token])

/**
 * Left to `sxToStyle`'s single `borderRadius` unless a corner or edge prop is present —
 * emitting per-corner keys unconditionally would shadow it with `undefined`.
 */
const cornerRadiiStyle = (sx: ViewSx): ViewStyle => {
  if (!CORNER_KEYS.some(key => sx[key] !== undefined)) {
    return {}
  }

  const all = radius(sx.borderRadius)
  const bottom = radius(sx.borderBottomRadius)
  const left = radius(sx.borderLeftRadius)
  const right = radius(sx.borderRightRadius)
  const top = radius(sx.borderTopRadius)

  return {
    borderBottomLeftRadius: radius(sx.borderBottomLeftRadius) ?? bottom ?? left ?? all,
    borderBottomRightRadius: radius(sx.borderBottomRightRadius) ?? bottom ?? right ?? all,
    borderTopLeftRadius: radius(sx.borderTopLeftRadius) ?? top ?? left ?? all,
    borderTopRightRadius: radius(sx.borderTopRightRadius) ?? top ?? right ?? all,
  }
}

const marginStyle = (sx: ViewSx): ViewStyle => {
  const all = space(sx.m)
  const x = space(sx.mx)
  const y = space(sx.my)

  return {
    marginBottom: space(sx.mb) ?? y ?? all,
    marginLeft: space(sx.ml) ?? x ?? all,
    marginRight: space(sx.mr) ?? x ?? all,
    marginTop: space(sx.mt) ?? y ?? all,
  }
}

const borderStyle = (sx: ViewSx): ViewStyle => ({
  borderBottomWidth: sx.borderBottomWidth,
  borderLeftWidth: sx.borderLeftWidth,
  borderRightWidth: sx.borderRightWidth,
  borderStyle: sx.borderStyle,
  borderTopWidth: sx.borderTopWidth,
})

/** `minH`/`minW` are `sxToStyle`'s, and naming them here would shadow it with `undefined`. */
const sizingStyle = (sx: ViewSx): ViewStyle => ({
  aspectRatio: sx.aspectRatio,
  maxHeight: sx.maxH,
  maxWidth: sx.maxW,
})

const flexStyle = (sx: ViewSx): ViewStyle => ({
  alignContent: sx.alignContent,
  alignItems: sx.align,
  alignSelf: sx.alignSelf,
  columnGap: space(sx.columnGap),
  flex: sx.flex,
  flexBasis: sx.basis,
  flexDirection: sx.flexDirection,
  flexGrow: sx.grow,
  flexShrink: sx.shrink,
  flexWrap: sx.wrap,
  gap: space(sx.gap),
  justifyContent: sx.justify,
  rowGap: space(sx.rowGap),
})

/** `zIndex` is `sxToStyle`'s too, for the same reason as `minH`/`minW` above. */
const layoutStyle = (sx: ViewSx): ViewStyle => ({
  bottom: sx.bottom,
  display: sx.display,
  left: sx.left,
  overflow: sx.overflow,
  position: sx.position,
  right: sx.right,
  top: sx.top,
})

export const viewSxToStyle = (sx: ViewSx, theme: Theme): ViewStyle => ({
  ...sxToStyle(sx, theme),
  ...cornerRadiiStyle(sx),
  ...marginStyle(sx),
  ...borderStyle(sx),
  ...sizingStyle(sx),
  ...flexStyle(sx),
  ...layoutStyle(sx),
})

/**
 * `split` hands back a `ResponsiveViewSx`, because that is what a component's props hold — `resolve`
 * only accepts the flat `ViewSx` that `flattenSx` turns those into, so the two cannot be crossed.
 */
export const viewSxCache = createSxCache<ViewSx, ViewStyle, ResponsiveViewSx>(VIEW_SX_KEYS, viewSxToStyle)
