import type {ResponsiveSx} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type HStackAlign = 'center' | 'end' | 'start'

export type HStackProps = ResponsiveSx & {
  align?: HStackAlign
  children?: ReactNode
  onPress?: () => void
  spacing?: SpaceSize
  testID?: string
}

export type HStackComponent = (props: HStackProps) => ReactNode
