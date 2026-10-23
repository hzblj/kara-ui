import type {SxDimension} from '@hzblj/kara-sx'
import type {RadiiSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * A loading placeholder that pulses in `fill.quaternary`, and holds still with motion reduced. Hidden from screen
 * readers: what is loading is for the screen to say. It is a React Native view, so it needs no host. Sized with the
 * `sx` names: `w`, `h`, `borderRadius`.
 */
export type SkeletonProps = {
  /** The corner radius. `small` by default. */
  borderRadius?: RadiiSize
  /** In points. */
  h: number
  /** Test identifier, forwarded to the view. */
  testID?: string
  /** In points, or a percentage of the row (`60%` for a line that ends early). Unset, it fills the row. */
  w?: SxDimension
}

export type SkeletonComponent = (props: SkeletonProps) => ReactNode
