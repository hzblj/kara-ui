import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type ZStackAlign = 'bottom' | 'center' | 'top'

export type ZStackProps = ResponsiveSx & {
  align?: ZStackAlign
  children?: ReactNode
  onPress?: () => void
  testID?: string
}

export type ZStackComponent = (props: ZStackProps) => ReactNode
