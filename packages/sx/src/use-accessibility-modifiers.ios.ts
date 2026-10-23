import {
  type AccessibilityTrait,
  accessibilityAddTraits,
  accessibilityElement,
  accessibilityHidden as hiddenModifier,
  accessibilityHint as hintModifier,
  accessibilityLabel as labelModifier,
  type ModifierConfig,
  accessibilityValue as valueModifier,
} from '@expo/ui/swift-ui/modifiers'
import {useMemo} from 'react'

import type {AccessibilityProps, AccessibilityRole} from './accessibility.types'

const TRAITS = {
  button: 'isButton',
  header: 'isHeader',
  image: 'isImage',
  link: 'isLink',
  text: 'isStaticText',
} as const satisfies Record<AccessibilityRole, AccessibilityTrait>

/** Roles a finger activates: SwiftUI reads their children as one element, as it does a `Button`'s label. */
const PRESSABLE = new Set<AccessibilityRole>(['button', 'link'])

/**
 * `AccessibilityProps` as SwiftUI modifiers, to go last in a view's modifiers: `accessibilityElement` wraps what comes
 * before it, so the label, hint and traits after it describe the combined element. `pressable` makes the view a
 * `button` unless its props name another role.
 */
export const useAccessibilityModifiers = (
  {
    accessibilityHidden,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityValue,
    accessible,
  }: AccessibilityProps,
  pressable = false
): ModifierConfig[] =>
  useMemo(() => {
    if (accessibilityHidden) {
      return [hiddenModifier(true)]
    }

    const role = accessibilityRole ?? (pressable ? 'button' : undefined)
    const modifiers: ModifierConfig[] = []

    if (accessible || (role && PRESSABLE.has(role))) {
      modifiers.push(accessibilityElement('combine'))
    }

    if (accessibilityLabel !== undefined) {
      modifiers.push(labelModifier(accessibilityLabel))
    }

    if (accessibilityHint !== undefined) {
      modifiers.push(hintModifier(accessibilityHint))
    }

    if (accessibilityValue !== undefined) {
      modifiers.push(valueModifier(accessibilityValue))
    }

    if (role) {
      modifiers.push(accessibilityAddTraits([TRAITS[role]]))
    }

    return modifiers
  }, [
    accessibilityHidden,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityValue,
    accessible,
    pressable,
  ])
