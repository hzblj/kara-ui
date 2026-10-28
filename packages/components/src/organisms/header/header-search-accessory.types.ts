import type {ReactNode} from 'react'

import type {IconName} from '../../atoms/icon'
import type {SearchFieldVoice} from '../../molecules/navigation-bar/navigation-bar.types'

export type HeaderSearchAccessoryProps = {
  cancelIcon?: IconName
  clearIcon?: IconName
  voice?: SearchFieldVoice
}

export type HeaderSearchAccessoryComponent = (props: HeaderSearchAccessoryProps) => ReactNode
