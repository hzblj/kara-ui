import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {IconName} from '../icon'

export type ButtonVariant = 'accent' | 'destructive' | 'glass' | 'plain' | 'secondary'

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

/**
 * A text button: SwiftUI `Button` on iOS, Material's filled button on Android (outlined for `glass`, a `TextButton`
 * for `plain`).
 */
export type ButtonProps = {
  /** What pressing it does, when the label alone does not say. See `AccessibilityProps`. */
  accessibilityHint?: string
  /**
   * Replaces the style the variant picks: `borderedProminent` for `accent` and `destructive`, `bordered` for
   * `secondary`, `glass` for `glass`, `borderless` for `plain`. iOS only. Android ignores it.
   */
  buttonStyle?: ButtonStyleName
  /** SwiftUI's control size. `large` by default. iOS only. Android ignores it. */
  controlSize?: ButtonControlSize
  /** Draws the button in its disabled colours and stops it responding to presses. */
  disabled?: boolean
  /**
   * One of the app's icons, before the label and in the label's colour. iOS sets the two as a SwiftUI `Label`; Android
   * puts the icon in the button's content row, as Material's buttons with an icon do. Screen readers read the label
   * only.
   */
  icon?: IconName
  /** The button's text. */
  label: string
  /** Called when the button is pressed. */
  onPress?: () => void
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /**
   * Overrides the variant's own tint. A prominent style takes it as the fill and picks a contrasting
   * label. `glass` has to reach the material through `glassEffect` instead, so tinting one costs it
   * the stock `.glass` style (see the iOS implementation). `plain` has no fill, so there it colours the label.
   */
  tint?: ColorToken
  /**
   * The look. `accent` by default. Material has no glass, so on Android `glass` is an outlined button. `plain` is a
   * text button in the accent, with no fill or border, for a lesser action beside a prominent one ("Skip", "Forgot
   * password?"): SwiftUI's `borderless` style, Material's `TextButton`.
   */
  variant?: ButtonVariant
  /** Stretches the button to the full width it is offered. On by default. */
  wide?: boolean
}

export type ButtonComponent = (props: ButtonProps) => ReactNode
