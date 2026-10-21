import type {RadiiSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type SkeletonProps = {
  borderRadius?: RadiiSize
  height: number
  testID?: string
  width?: number
}

export type SkeletonComponent = (props: SkeletonProps) => ReactNode
