import type {Sx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type ScreenProps = {
  bg?: Sx['bg']
  children?: ReactNode
  ignoreKeyboardInset?: boolean
  testID?: string
}

export type ScreenComponent = (props: ScreenProps) => ReactNode
