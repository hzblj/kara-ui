import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * iOS 26 Liquid Glass around a React Native subtree, shaped as a capsule — the React Native tier, so it needs no host
 * and costs next to nothing in a list cell. Where there is no Liquid Glass (Android, and iOS before 26) it draws a
 * capsule of `tint` instead, or of `fill.tertiary` when there is none.
 */
export type GlassViewProps = ResponsiveViewSx & {
  /** React Native views. Give them `pointerEvents="none"` when `interactive`, so the press reaches the `Pressable`. */
  children?: ReactNode
  /** Swells toward the finger on touch, carrying the children with it. Wrap the view in a `Pressable` for the press. */
  interactive?: boolean
  testID?: string
  /** Tints the material. Unset leaves it clear. */
  tint?: ColorToken
}

export type GlassViewComponent = (props: GlassViewProps) => ReactNode
