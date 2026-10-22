import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * Glass around a React Native subtree, shaped as a capsule — the React Native tier, so it needs no host. iOS 26:
 * Liquid Glass. Android: frosted glass — what lies behind, blurred on Android 12+, under a translucent tonal surface
 * (or `tint`) and a hairline. iOS before 26 has no Liquid Glass and draws a capsule of `tint` instead, or of the glass
 * buttons' translucent fill (`btn.bg.glass.base`) when there is none.
 *
 * On Android each glass re-records what lies behind it before every frame: a few buttons cost nothing, but keep it out
 * of the cells of a long list — a plain `tint` reads as well there.
 */
export type GlassViewProps = ResponsiveViewSx & {
  /** React Native views. Give them `pointerEvents="none"` when `interactive`, so the press reaches the `Pressable`. */
  children?: ReactNode
  /**
   * iOS 26: swells toward the finger on touch, carrying the children with it. Android has no swell: wrap the view in a
   * `Pressable` with `borderRadius="full"`, whose ripple then keeps to the capsule. The press is always the `Pressable`'s.
   */
  interactive?: boolean
  /** Test identifier, forwarded to the view. */
  testID?: string
  /** Tints the material. Unset leaves it clear on iOS, and the translucent surface colour on Android. */
  tint?: ColorToken
}

export type GlassViewComponent = (props: GlassViewProps) => ReactNode
