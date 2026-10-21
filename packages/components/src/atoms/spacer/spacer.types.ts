import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type SpacerProps = {
  min?: SpaceSize
  testID?: string
}

export type SpacerComponent = (props: SpacerProps) => ReactNode
