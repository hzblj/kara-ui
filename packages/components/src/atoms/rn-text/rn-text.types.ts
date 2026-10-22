import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import type {TextProps as RNTextProps} from 'react-native'

/** React Native's `Text` in a theme typography variant — the React Native tier, for text outside a native host. */
export type RnTextProps = Omit<RNTextProps, 'style'> & {
  /** Horizontal alignment, as React Native's `textAlign`. */
  align?: 'center' | 'left' | 'right'
  /** The text's colour. `content.primary` by default. */
  color?: ColorToken
  /** The typography variant. `body` by default. */
  variant?: TextVariant
}

export type RnTextComponent = (props: RnTextProps) => ReactNode
