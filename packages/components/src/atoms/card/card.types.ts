import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type CardProps = ResponsiveSx & {
  children?: ReactNode
  testID?: string
}

export type CardComponent = (props: CardProps) => ReactNode
