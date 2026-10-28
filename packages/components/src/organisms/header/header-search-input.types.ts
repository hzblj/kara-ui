import type {ReactNode, Ref} from 'react'

import type {IconName} from '../../atoms/icon'
import type {SearchFieldVoice} from '../../molecules/navigation-bar/navigation-bar.types'

export type HeaderSearchInputRef = {
  blur: () => void
  clear: () => void
  setText: (text: string) => void
}

export type HeaderSearchInputProps = {
  clearIcon?: IconName
  onChangeText: (text: string) => void
  onFocusChange: (focused: boolean) => void
  placeholder: string
  ref?: Ref<HeaderSearchInputRef>
  voice?: SearchFieldVoice
}

export type HeaderSearchInputComponent = (props: HeaderSearchInputProps) => ReactNode
