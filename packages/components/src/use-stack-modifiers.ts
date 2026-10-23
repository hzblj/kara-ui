import {clickable, type ModifierConfig, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {
  type AccessibilityProps,
  type ResponsiveSx,
  splitAccessibility,
  useAccessibilityModifiers,
  useSxModifiers,
} from '@hzblj/kara-sx'
import {useMemo} from 'react'

/**
 * A Compose stack's modifiers in the order a pressable one needs: its frame, shape and background, then the press, its
 * semantics, then its padding. Compose clips a `clickable` to what comes after it, so with the padding first the ripple
 * would stop at the padding and a row pressed by its edge would light up only in the middle. The semantics come after
 * the click, because a label that replaces the children's clears whatever semantics are inside it.
 */
export const useStackModifiers = (
  props: ResponsiveSx & AccessibilityProps,
  onPress?: () => void,
  testID?: string
): ModifierConfig[] => {
  const [accessibility, {p, pb, pl, pr, pt, px, py, ...frame}] = splitAccessibility(props)
  const frameModifiers = useSxModifiers(frame)
  const paddingModifiers = useSxModifiers({p, pb, pl, pr, pt, px, py})
  const accessibilityModifiers = useAccessibilityModifiers(accessibility, onPress !== undefined)

  return useMemo(
    () => [
      ...frameModifiers,
      ...(testID ? [testIdModifier(testID)] : []),
      ...(onPress ? [clickable(onPress)] : []),
      ...accessibilityModifiers,
      ...paddingModifiers,
    ],
    [accessibilityModifiers, frameModifiers, onPress, paddingModifiers, testID]
  )
}
