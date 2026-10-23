import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type ButtonVariant = 'accent' | 'destructive' | 'glass' | 'secondary'

/**
 * SwiftUI `ButtonStyle`. iOS only: Compose has no equivalent, so Android ignores it and keeps
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
 * SwiftUI `ControlSize`. iOS only, and it has no `automatic` member: leave it unset to inherit
 * whatever the surrounding SwiftUI environment provides.
 */
export type ButtonControlSize = 'extraLarge' | 'large' | 'mini' | 'regular' | 'small'

/** A text button: SwiftUI `Button` on iOS, Material's filled button (outlined for `glass`) on Android. */
export type ButtonProps = {
  /** What pressing it does, when the label alone does not say. See `AccessibilityProps`. */
  accessibilityHint?: string
  /**
   * Replaces the style the variant picks: `borderedProminent` for `accent` and `destructive`, `bordered` for
   * `secondary`, `glass` for `glass`. iOS only. Android ignores it.
   */
  buttonStyle?: ButtonStyleName
  /** SwiftUI's control size. `large` by default. iOS only. Android ignores it. */
  controlSize?: ButtonControlSize
  /** Draws the button in its disabled colours and stops it responding to presses. */
  disabled?: boolean
  /** The button's text. */
  label: string
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /**
   * Overrides the variant's own tint. A prominent style takes it as the fill and picks a contrasting
   * label. `glass` has to reach the material through `glassEffect` instead, so tinting one costs it
   * the stock `.glass` style (see the iOS implementation).
   */
  tint?: ColorToken
  /** The look. `accent` by default. Material has no glass, so on Android `glass` is an outlined button. */
  variant?: ButtonVariant
  /** Stretches the button to the full width it is offered. On by default. */
  wide?: boolean
}

export type ButtonComponent = (props: ButtonProps) => ReactNode
