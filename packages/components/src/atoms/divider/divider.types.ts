import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type DividerProps = {
  color?: ColorToken
  testID?: string
}

export type DividerComponent = (props: DividerProps) => ReactNode
