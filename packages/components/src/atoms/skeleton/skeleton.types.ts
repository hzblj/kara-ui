import type {RadiiSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/** A loading placeholder that pulses in `fill.quaternary` — a React Native view, so it needs no host. */
export type SkeletonProps = {
  /** The corner radius. `small` by default. */
  borderRadius?: RadiiSize
  /** In points. */
  height: number
  /** Test identifier, forwarded to the view. */
  testID?: string
  /** In points. Leave it unset and it fills the available width. */
  width?: number
}

export type SkeletonComponent = (props: SkeletonProps) => ReactNode
