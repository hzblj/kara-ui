import type {AccessibilityProps as RNAccessibilityProps} from 'react-native'

import type {AccessibilityProps, AccessibilityRole} from './accessibility.types'

/**
 * `AccessibilityProps` as React Native's own, for a React Native tier component that takes kara's set: the same
 * names, `accessibilityHidden` as `aria-hidden` and a string `accessibilityValue` as its `text`. `role` is the
 * component's own, used when its props name none: a `Pressable` is a `button`.
 */
export const accessibilityProps = (
  {
    accessibilityHidden,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityValue,
    accessible,
  }: AccessibilityProps,
  role?: AccessibilityRole
): RNAccessibilityProps => ({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole: accessibilityRole ?? role,
  accessibilityValue: accessibilityValue === undefined ? undefined : {text: accessibilityValue},
  accessible,
  'aria-hidden': accessibilityHidden,
})
