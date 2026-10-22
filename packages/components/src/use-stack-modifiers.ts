import {clickable, type ModifierConfig, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {type ResponsiveSx, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'

/**
 * A Compose stack's modifiers in the order a pressable one needs: its frame, shape and background, then the press,
 * then its padding. Compose clips a `clickable` to what comes after it, so with the padding first the ripple would stop
 * at the padding and a row pressed by its edge would light up only in the middle.
 */
export const useStackModifiers = (sx: ResponsiveSx, onPress?: () => void, testID?: string): ModifierConfig[] => {
  const {p, pb, pl, pr, pt, px, py, ...frame} = sx
  const frameModifiers = useSxModifiers(frame)
  const paddingModifiers = useSxModifiers({p, pb, pl, pr, pt, px, py})

  return useMemo(
    () => [
      ...frameModifiers,
      ...(testID ? [testIdModifier(testID)] : []),
      ...(onPress ? [clickable(onPress)] : []),
      ...paddingModifiers,
    ],
    [frameModifiers, onPress, paddingModifiers, testID]
  )
}
