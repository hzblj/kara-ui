import {type ShadowColors, type ShadowGeometry, type ShadowName, shadowGeometry} from '../primitives/shadows'
import type {Theme} from '../theme.types'

/** A scale as it looks to a walk that does not yet know whether it is standing on a group or a leaf. */
type Node<TLeaf> = TLeaf | {[segment: string]: Node<TLeaf>}

const descend = <TLeaf>(node: Node<TLeaf> | undefined, segment: string): Node<TLeaf> | undefined =>
  typeof node === 'object' && node !== null ? (node as {[key: string]: Node<TLeaf>})[segment] : undefined

/**
 * `ShadowName` is derived from the scale itself, so every name that type-checks names a leaf that exists —
 * which is what makes the cast at the end sound rather than hopeful.
 */
const atPath = <TLeaf>(root: Node<TLeaf>, name: ShadowName): TLeaf =>
  name.split('.').reduce<Node<TLeaf> | undefined>(descend, root) as TLeaf

export type ResolvedShadow = {
  colors: ShadowColors
  geometry: ShadowGeometry
}

/**
 * One shadow's geometry and its colours, found by walking the dotted name. Both trees share their shape by
 * construction — the palette's is declared as `ShadowTreeOf<ShadowColors>` — so a name can never find the
 * geometry but miss the colours.
 */
export const resolveShadow = (theme: Theme, name: ShadowName): ResolvedShadow => ({
  colors: atPath<ShadowColors>(theme.shadow as Node<ShadowColors>, name),
  geometry: atPath<ShadowGeometry>(shadowGeometry as Node<ShadowGeometry>, name),
})
