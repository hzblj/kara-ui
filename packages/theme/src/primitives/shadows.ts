import type {PaletteColor} from './color-source'

export type ShadowGeometry = {
  drop?: {radius: number; y: number}
  inset?: {radius: number}
  ring?: {width: number}
}

export type ShadowColors = {
  drop?: PaletteColor
  inset?: PaletteColor
  ring?: PaletteColor
}

/** A group of shadows, or one shadow's geometry — what a walk sees before it knows which it has. */
type ShadowNode = ShadowGeometry | {[segment: string]: ShadowNode}

/**
 * `card` and `input` carry no drop at all — they are hairlines, which both platforms draw with a separator
 * colour rather than a shadow. They stay in this scale because they are still *one* stroke the box traces,
 * which is what the resolvers know how to apply.
 */
export const shadowGeometry = {
  btn: {
    accent: {
      drop: {radius: 6, y: 2},
      inset: {radius: 2},
      ring: {width: 0.5},
    },
    destructive: {
      drop: {radius: 6, y: 2},
      inset: {radius: 2},
      ring: {width: 0.5},
    },
    glass: {
      drop: {radius: 6, y: 2},
      inset: {radius: 2},
      ring: {width: 0.5},
    },
    secondary: {
      drop: {radius: 6, y: 2},
      inset: {radius: 2},
      ring: {width: 0.5},
    },
  },
  card: {ring: {width: 0.5}},
  input: {ring: {width: 0.5}},
  snackbar: {
    drop: {radius: 24, y: 4},
    inset: {radius: 1},
    ring: {width: 0.5},
  },
} as const satisfies Record<string, ShadowNode>

const GEOMETRY_KEYS = ['drop', 'inset', 'ring'] as const

type GeometryKey = (typeof GEOMETRY_KEYS)[number]

/**
 * Whether a node is one shadow's geometry rather than a group of them, decided by key presence. It cannot be
 * `extends ShadowGeometry`: every key of that type is optional, so a *group* of shadows satisfies it too and
 * the walk would stop a level early — `btn` would read as a shadow and `btn.accent` would not exist.
 */
type IsGeometry<TNode> = [Extract<keyof TNode, GeometryKey>] extends [never] ? false : true

/** Every dotted path from the scale down to one geometry — the walk `ColorPaths` does over the palette. */
type ShadowPaths<TNode> = {
  [TKey in keyof TNode & string]: IsGeometry<TNode[TKey]> extends true ? TKey : `${TKey}.${ShadowPaths<TNode[TKey]>}`
}[keyof TNode & string]

export type ShadowName = ShadowPaths<typeof shadowGeometry>

/**
 * The scale's shape with something else at its leaves — what the palette's `shadow` is declared as, so the
 * colours and the geometry cannot drift apart or miss an entry.
 */
export type ShadowTreeOf<TLeaf> = ShadowTree<typeof shadowGeometry, TLeaf>

type ShadowTree<TNode, TLeaf> = {
  [TKey in keyof TNode]: IsGeometry<TNode[TKey]> extends true ? TLeaf : ShadowTree<TNode[TKey], TLeaf>
}

const isGeometry = (node: object): boolean => GEOMETRY_KEYS.some(key => key in node)

const flatten = (node: object, prefix: string): string[] =>
  Object.entries(node).flatMap(([segment, child]) => {
    const path = prefix ? `${prefix}.${segment}` : segment

    return isGeometry(child) ? [path] : flatten(child, path)
  })

/** Every name in the scale, flat — for anything that has to enumerate them rather than name one. */
export const shadowNames = flatten(shadowGeometry, '') as ShadowName[]
