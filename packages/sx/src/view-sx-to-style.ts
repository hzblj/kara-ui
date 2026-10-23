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
  absolute: true,
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
  center: true,
  columnGap: true,
  display: true,
  fill: true,
  flex: true,
  flexDirection: true,
  gap: true,
  grow: true,
  inset: true,
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
  row: true,
  rowGap: true,
  shrink: true,
  size: true,
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

type StyleTarget = Record<string, unknown>

/**
 * Writes a value only when there is one. A resolved style carries the keys a call site set and no others: written as
 * `undefined`, the forty-odd keys a `Box` could set would each be walked by React Native on every mount (a list mounts
 * many), and could shadow a key an earlier step had written.
 */
const put = (style: StyleTarget, key: string, value: unknown) => {
  if (value !== undefined) {
    style[key] = value
  }
}

/** Left to `sxToStyle`'s single `borderRadius` unless a corner or edge prop is present. */
const putCornerRadii = (style: StyleTarget, sx: ViewSx) => {
  if (!CORNER_KEYS.some(key => sx[key] !== undefined)) {
    return
  }

  const all = radius(sx.borderRadius)
  const bottom = radius(sx.borderBottomRadius)
  const left = radius(sx.borderLeftRadius)
  const right = radius(sx.borderRightRadius)
  const top = radius(sx.borderTopRadius)

  put(style, 'borderBottomLeftRadius', radius(sx.borderBottomLeftRadius) ?? bottom ?? left ?? all)
  put(style, 'borderBottomRightRadius', radius(sx.borderBottomRightRadius) ?? bottom ?? right ?? all)
  put(style, 'borderTopLeftRadius', radius(sx.borderTopLeftRadius) ?? top ?? left ?? all)
  put(style, 'borderTopRightRadius', radius(sx.borderTopRightRadius) ?? top ?? right ?? all)
}

const putMargins = (style: StyleTarget, sx: ViewSx) => {
  const all = space(sx.m)
  const x = space(sx.mx)
  const y = space(sx.my)

  put(style, 'marginBottom', space(sx.mb) ?? y ?? all)
  put(style, 'marginLeft', space(sx.ml) ?? x ?? all)
  put(style, 'marginRight', space(sx.mr) ?? x ?? all)
  put(style, 'marginTop', space(sx.mt) ?? y ?? all)
}

type MarginKey = 'm' | 'mb' | 'ml' | 'mr' | 'mt' | 'mx' | 'my'

/** The shorthands, which write several style properties at once and give way to the keys they stand in for. */
type ShorthandKey = 'absolute' | 'center' | 'fill' | 'row' | 'size'

/**
 * The view-only keys that map one to one onto a style property. A `Record` held to every view-only key but the corners
 * and the margins (which cascade), so a key added to `ViewSx` and forgotten here refuses to compile rather than
 * resolve to nothing. `minH`/`minW` and `zIndex` are `sxToStyle`'s.
 */
const DIRECT = {
  align: 'alignItems',
  alignContent: 'alignContent',
  alignSelf: 'alignSelf',
  aspectRatio: 'aspectRatio',
  basis: 'flexBasis',
  borderBottomWidth: 'borderBottomWidth',
  borderLeftWidth: 'borderLeftWidth',
  borderRightWidth: 'borderRightWidth',
  borderStyle: 'borderStyle',
  borderTopWidth: 'borderTopWidth',
  bottom: 'bottom',
  columnGap: 'columnGap',
  display: 'display',
  flex: 'flex',
  flexDirection: 'flexDirection',
  gap: 'gap',
  grow: 'flexGrow',
  inset: 'inset',
  justify: 'justifyContent',
  left: 'left',
  maxH: 'maxHeight',
  maxW: 'maxWidth',
  overflow: 'overflow',
  position: 'position',
  right: 'right',
  rowGap: 'rowGap',
  shrink: 'flexShrink',
  top: 'top',
  wrap: 'flexWrap',
} as const satisfies Record<Exclude<ViewOnlyKey, keyof ViewRadiiSx | MarginKey | ShorthandKey>, keyof ViewStyle>

const DIRECT_ENTRIES = Object.entries(DIRECT) as [keyof typeof DIRECT, string][]

/** The gaps take spacing tokens; every other direct key is the style value itself. */
const SPACED = new Set<string>(['columnGap', 'gap', 'rowGap'])

/** `grow` and `shrink` read `true` as 1 and `false` as 0; `wrap` reads them as `wrap` and `nowrap`. */
const directValue = (key: keyof typeof DIRECT, value: unknown): unknown => {
  if (typeof value !== 'boolean') {
    return SPACED.has(key) ? space(value as SpaceKey) : value
  }

  if (key === 'wrap') {
    return value ? 'wrap' : 'nowrap'
  }

  return value ? 1 : 0
}

/** Written before the direct keys, so any key a shorthand stands in for overrides it. */
const putShorthands = (style: StyleTarget, sx: ViewSx) => {
  if (sx.row) {
    style.flexDirection = 'row'
  }

  if (sx.center) {
    style.alignItems = 'center'
    style.justifyContent = 'center'
  }

  if (sx.fill) {
    style.flex = 1
  }

  if (sx.absolute) {
    style.position = 'absolute'
    style.inset = 0
  }

  if (sx.size !== undefined) {
    // `w` and `h` (and `wide` and `tall`) were written by `sxToStyle` already and win.
    style.width ??= sx.size
    style.height ??= sx.size
  }
}

export const viewSxToStyle = (sx: ViewSx, theme: Theme): ViewStyle => {
  const style = sxToStyle(sx, theme) as StyleTarget

  putShorthands(style, sx)

  for (const [key, property] of DIRECT_ENTRIES) {
    const value = sx[key]

    if (value !== undefined) {
      style[property] = directValue(key, value)
    }
  }

  putCornerRadii(style, sx)
  putMargins(style, sx)

  return style as ViewStyle
}

/**
 * `split` hands back a `ResponsiveViewSx`, because that is what a component's props hold — `resolve`
 * only accepts the flat `ViewSx` that `flattenSx` turns those into, so the two cannot be crossed.
 */
export const viewSxCache = createSxCache<ViewSx, ViewStyle, ResponsiveViewSx>(VIEW_SX_KEYS, viewSxToStyle)
