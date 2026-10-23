import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

/**
 * A container on `surface.primary`, padded `s16` and rounded `large` unless told otherwise — a SwiftUI `VStack` on
 * iOS, Material's `Surface` around a `Column` on Android.
 */
export type SurfaceProps = ResponsiveSx & {
  /** Stacked vertically, from the leading edge. */
  children?: ReactNode
  /** iOS wraps the content in a `GlassEffectContainer`; Android raises it to a tonal elevation of `3`. */
  glass?: boolean
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type SurfaceComponent = (props: SurfaceProps) => ReactNode
