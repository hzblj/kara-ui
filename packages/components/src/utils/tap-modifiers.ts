import {contentShape, type ModifierConfig, onTapGesture, shapes} from '@expo/ui/swift-ui/modifiers'

/**
 * A SwiftUI stack's `onPress`: the whole frame takes the tap, padding and a `Spacer`'s gap included. `onTapGesture`
 * alone hit-tests only what draws, so a `LabeledContent` row pressed in its empty middle did nothing; the rectangle
 * content shape makes it answer anywhere, as the Compose stacks' `clickable` already does.
 */
export const tapModifiers = (onPress: (() => void) | undefined): ModifierConfig[] =>
  onPress ? [contentShape(shapes.rectangle()), onTapGesture(onPress)] : []
