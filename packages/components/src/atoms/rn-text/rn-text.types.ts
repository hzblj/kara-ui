import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import type {TextProps as RNTextProps} from 'react-native'

export type RnTextProps = Omit<RNTextProps, 'style'> & {
  align?: 'center' | 'left' | 'right'
  color?: ColorToken
  variant?: TextVariant
}

export type RnTextComponent = (props: RnTextProps) => ReactNode
