import {CircularProgressIndicator, LinearProgressIndicator} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {useAppTheme, withOpacity} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {ProgressComponent, ProgressProps} from './progress.types'

/**
 * Material draws the track in the seeded scheme's `secondaryContainer`, a pale accent: under a red or a green bar it
 * would read as a second colour. Any other colour gets its own faded track instead, the way the accent's is pale; the
 * accent keeps Material's. An indeterminate ring has no track in Material, so it is left without one.
 */
export const Progress: ProgressComponent = ({
  accessibilityLabel,
  circular = false,
  color = 'fill.accent.primary',
  testID,
  value,
}: ProgressProps) => {
  useHostGuard('Progress')
  const theme = useAppTheme()
  const indicator = theme.color(color)
  // The website reads the default above from the source, so it stays a literal rather than a shared constant.
  const track = color === 'fill.accent.primary' ? undefined : withOpacity(String(indicator), 'o20')
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityLabel})
  const modifiers = useMemo(
    () => (testID ? [testIdModifier(testID), ...accessibilityModifiers] : accessibilityModifiers),
    [accessibilityModifiers, testID]
  )

  if (circular) {
    return (
      <CircularProgressIndicator
        color={indicator}
        modifiers={modifiers}
        progress={value}
        trackColor={value === undefined ? undefined : track}
      />
    )
  }

  return <LinearProgressIndicator color={indicator} modifiers={modifiers} progress={value} trackColor={track} />
}
