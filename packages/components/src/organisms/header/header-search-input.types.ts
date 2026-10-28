import type {ReactNode, Ref} from 'react'

export type HeaderSearchInputRef = {
  blur: () => void
  clear: () => void
}

export type HeaderSearchInputProps = {
  onChangeText: (text: string) => void
  onFocusChange: (focused: boolean) => void
  placeholder: string
  ref?: Ref<HeaderSearchInputRef>
}

export type HeaderSearchInputComponent = (props: HeaderSearchInputProps) => ReactNode
