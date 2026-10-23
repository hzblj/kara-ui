import {createModifier, type ModifierConfig} from '@expo/ui/jetpack-compose/modifiers'

export type AccessibilityParams = {
  /** Clears the composable and its children from TalkBack. */
  hidden?: boolean
  /** On a pressable role, the click action's label: TalkBack's "Double tap to …". */
  hint?: string
  /** The content description. On an element that merges its children, it replaces what they would say. */
  label?: string
  /** Reads the composable and its children as one element. A pressable role merges by itself. */
  merge?: boolean
  /** `button` and `image` set Compose's `Role`, `header` marks a heading, `link` merges like a button. */
  role?: 'button' | 'header' | 'image' | 'link' | 'text'
  /** The state description, read after the label. */
  value?: string
}

/**
 * Kara's accessibility semantics for a composable: a content description, a role or heading, a state description,
 * the click action's label, merging, or clearing it from TalkBack. `@expo/ui`'s `semantics` carries only the content
 * description.
 */
export const accessibility = (params: AccessibilityParams): ModifierConfig =>
  createModifier('karaAccessibility', params)
