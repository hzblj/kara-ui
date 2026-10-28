import {Host, LoadingIndicator} from '@expo/ui/jetpack-compose'
import {fillMaxSize, size as sizeModifier, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {StyleSheet} from 'react-native'

import {useInsideHost} from '../../hooks/host-context'
import type {ActivityIndicatorComponent, ActivityIndicatorProps} from './activity-indicator.types'

/** Material's 48dp for a screen; half of it in a row, about where React Native's small spinner sat. */
const styles = StyleSheet.create({
  large: {height: 48, width: 48},
  small: {height: 24, width: 24},
})

/**
 * Material 3's expressive `LoadingIndicator` in a host of its own, sized here rather than measured, so it renders
 * anywhere and takes its place in the first frame. Inside a `Screen` or `Island` it renders into that host instead (see
 * `useInsideHost`), the same size.
 */
export const ActivityIndicator: ActivityIndicatorComponent = ({
  accessibilityLabel,
  color = 'fill.accent.primary',
  size = 'small',
  testID,
}: ActivityIndicatorProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityLabel})
  const modifiers = useMemo(
    () => [
      insideHost ? sizeModifier(styles[size].width, styles[size].height) : fillMaxSize(),
      ...(testID ? [testIdModifier(testID)] : []),
      ...accessibilityModifiers,
    ],
    [accessibilityModifiers, insideHost, size, testID]
  )

  const indicator = <LoadingIndicator color={theme.color(color)} modifiers={modifiers} />

  if (insideHost) {
    return indicator
  }

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} seedColor={theme.materialSeed} style={styles[size]}>
      {indicator}
    </Host>
  )
}
