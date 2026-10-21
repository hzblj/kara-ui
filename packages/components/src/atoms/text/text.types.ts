import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type TextAlign = 'center' | 'left' | 'right'

export type TextDecoration = 'none' | 'strikethrough' | 'underline'

export type TextTransform = 'lowercase' | 'uppercase'

export type TextProps = {
  align?: TextAlign
  children?: ReactNode
  color?: ColorToken
  decoration?: TextDecoration
  numberOfLines?: number
  testID?: string
  transform?: TextTransform
  variant?: TextVariant
}

export type TextComponent = (props: TextProps) => ReactNode
