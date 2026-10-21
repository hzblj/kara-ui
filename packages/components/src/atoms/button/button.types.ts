import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type ButtonVariant = 'accent' | 'destructive' | 'glass' | 'secondary'

/**
 * SwiftUI `ButtonStyle`. iOS only — Compose has no equivalent, so Android ignores it and keeps
 * rendering the variant's tokens.
 */
export type ButtonStyleName =
  | 'automatic'
  | 'bordered'
  | 'borderedProminent'
  | 'borderless'
  | 'glass'
  | 'glassProminent'
  | 'plain'

/**
 * SwiftUI `ControlSize`. iOS only, and it has no `automatic` member — leave it unset to inherit
 * whatever the surrounding SwiftUI environment provides.
 */
export type ButtonControlSize = 'extraLarge' | 'large' | 'mini' | 'regular' | 'small'

export type ButtonProps = {
  buttonStyle?: ButtonStyleName
  controlSize?: ButtonControlSize
  disabled?: boolean
  label: string
  onPress?: () => void
  testID?: string
  /**
   * Overrides the variant's own tint. A prominent style takes it as the fill and picks a contrasting
   * label. `glass` has to reach the material through `glassEffect` instead, so tinting one costs it
   * the stock `.glass` style — see the iOS implementation.
   */
  tint?: ColorToken
  variant?: ButtonVariant
  wide?: boolean
}

export type ButtonComponent = (props: ButtonProps) => ReactNode
