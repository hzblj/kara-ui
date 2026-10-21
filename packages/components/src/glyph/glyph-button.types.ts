import type {GlyphName} from '@hzblj/kara-native'
import type {ReactNode} from 'react'

/** An icon button over one of kara's glyphs — for the controls its own components build (a stepper, a bar). */
export type GlyphButtonProps = {
  accessibilityLabel?: string
  disabled?: boolean
  name: GlyphName
  onPress?: () => void
}

export type GlyphButtonComponent = (props: GlyphButtonProps) => ReactNode
