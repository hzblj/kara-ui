import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type SurfaceProps = ResponsiveSx & {
  children?: ReactNode
  glass?: boolean
  testID?: string
}

export type SurfaceComponent = (props: SurfaceProps) => ReactNode
