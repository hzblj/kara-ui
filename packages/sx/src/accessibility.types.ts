/**
 * What a view is, so VoiceOver and TalkBack announce it ("Button", "Heading") and their rotors find it. A subset of
 * React Native's roles: the ones both platforms can say.
 */
export type AccessibilityRole = 'button' | 'header' | 'image' | 'link' | 'text'

/**
 * What a screen reader is told about a native view, one set of props for both platforms: SwiftUI's accessibility
 * modifiers on iOS, Compose semantics on Android. Named as React Native names them, so the React Native tier, which
 * takes React Native's own props, reads the same.
 */
export type AccessibilityProps = {
  /** Hides the view and everything in it from VoiceOver and TalkBack: a decorative image, a label read elsewhere. */
  accessibilityHidden?: boolean
  /**
   * What activating the view does, when its label alone does not say. Phrase it as an action ("open the photo"): iOS
   * reads it after a pause, Android as TalkBack's "Double tap to open the photo", on a pressable view only.
   */
  accessibilityHint?: string
  /**
   * What a screen reader says for the view, in place of what it would read from its content. On a view read as one
   * element (`accessible`, a pressable stack) it replaces what the children would say.
   */
  accessibilityLabel?: string
  /** What the view is. A stack with `onPress` is a `button` unless told otherwise; `link` is announced on iOS only. */
  accessibilityRole?: AccessibilityRole
  /** Where the view stands, read after its label: "3 of 5", "On", "50 percent". */
  accessibilityValue?: string
  /** Reads the view and everything in it as one element: a row with a title and a subtitle, a card. */
  accessible?: boolean
}

/** Every key of `AccessibilityProps`, for `splitAccessibility`. */
export const ACCESSIBILITY_KEYS = [
  'accessibilityHidden',
  'accessibilityHint',
  'accessibilityLabel',
  'accessibilityRole',
  'accessibilityValue',
  'accessible',
] as const satisfies readonly (keyof AccessibilityProps)[]

const ACCESSIBILITY_KEY_SET = new Set<string>(ACCESSIBILITY_KEYS)

/**
 * A component's props in two: the accessibility ones, for `useAccessibilityModifiers`, and the rest, untouched. What
 * keeps them out of a spread that becomes `sx`.
 */
export const splitAccessibility = <TProps extends AccessibilityProps>(
  props: TProps
): [AccessibilityProps, Omit<TProps, keyof AccessibilityProps>] => {
  const own: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    const target = ACCESSIBILITY_KEY_SET.has(key) ? own : rest
    target[key] = props[key as keyof TProps]
  }

  return [own as AccessibilityProps, rest as Omit<TProps, keyof AccessibilityProps>]
}
