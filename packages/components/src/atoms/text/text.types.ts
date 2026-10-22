import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type TextAlign = 'center' | 'left' | 'right'

export type TextDecoration = 'none' | 'strikethrough' | 'underline'

export type TextTransform = 'lowercase' | 'uppercase'

/** SwiftUI `Text` / Compose `Text` in a theme typography variant — a native atom; outside a host, use `RnText`. */
export type TextProps = {
  /**
   * How its lines align. iOS reads `left` and `right` as leading and trailing, so they flip in a right-to-left
   * layout; Android keeps them as they are.
   */
  align?: TextAlign
  /** The text. */
  children?: ReactNode
  /** The text's colour. `content.primary` by default. */
  color?: ColorToken
  /** An underline or a strikethrough. */
  decoration?: TextDecoration
  /** The most lines it wraps to. iOS truncates the last with an ellipsis; Android clips it. */
  numberOfLines?: number
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** Upper- or lower-cases the text. Android applies it only when `children` is a plain string. */
  transform?: TextTransform
  /** The typography variant. `body` by default. */
  variant?: TextVariant
}

export type TextComponent = (props: TextProps) => ReactNode
