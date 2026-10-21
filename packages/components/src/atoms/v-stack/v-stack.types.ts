import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type VStackAlign = 'center' | 'end' | 'start'

export type VStackProps = ResponsiveSx & {
  align?: VStackAlign
  children?: ReactNode
  onPress?: () => void
  spacing?: SpaceSize
  testID?: string
}

export type VStackComponent = (props: VStackProps) => ReactNode
