import type {ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'
import {accessibility} from '@hzblj/kara-native/jetpack-compose'
import {useMemo} from 'react'

import type {AccessibilityProps} from './accessibility.types'

const NONE: ModifierConfig[] = []

/**
 * `AccessibilityProps` as one Compose semantics modifier (`karaAccessibility`, registered by `@hzblj/kara-native`).
 * Put it after a `clickable`: a label that replaces the children's clears the semantics inside it, and the click's
 * must stay outside. `pressable` makes the view a `button` unless its props name another role.
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
    const role = accessibilityRole ?? (pressable ? 'button' : undefined)

    if (
      !accessibilityHidden &&
      !accessible &&
      !role &&
      accessibilityHint === undefined &&
      accessibilityLabel === undefined &&
      accessibilityValue === undefined
    ) {
      return NONE
    }

    return [
      accessibility({
        hidden: accessibilityHidden,
        hint: accessibilityHint,
        label: accessibilityLabel,
        merge: accessible,
        role,
        value: accessibilityValue,
      }),
    ]
  }, [
    accessibilityHidden,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityValue,
    accessible,
    pressable,
  ])
