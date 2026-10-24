import {Host, SegmentedButton, SingleChoiceSegmentedButtonRow, Text} from '@expo/ui/jetpack-compose'
import {fillMaxWidth, testID as testIdModifier, weight} from '@expo/ui/jetpack-compose/modifiers'
import {haptics} from '@hzblj/expo-rich-haptics'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/** Every segment the same width, like UIKit's: Material's would size each to its label. */
const SEGMENT = [weight(1)]

/**
 * Material's single-choice segmented buttons, the selected one filled with the accent like a checked `Switch`. Its own
 * host, themed like an `Island`, so it drops into React Native layout the way the iOS control does. Inside a `Screen`
 * or `Island` it renders into that host instead (see `useInsideHost`). Material plays nothing on a new segment, so this
 * plays `selection`.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  disabled = false,
  onChange,
  selectedIndex,
  testID,
  values,
}: SegmentedControlProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()

  // Every segment keeps the same outline, the selected one too: an accent border would run its fill out over the line
  // the others draw inside, and make it look taller than its neighbours.
  const colors = useMemo(
    () => ({
      activeBorderColor: theme.color('border.secondary.base'),
      activeContainerColor: theme.color('fill.accent.primary'),
      activeContentColor: theme.color('content.on.accent'),
      disabledActiveBorderColor: theme.color('border.tertiary'),
      disabledActiveContainerColor: theme.color('fill.accent.disabled'),
      disabledActiveContentColor: theme.color('btn.content.disabled'),
      disabledInactiveBorderColor: theme.color('border.tertiary'),
      disabledInactiveContentColor: theme.color('btn.content.disabled'),
      inactiveBorderColor: theme.color('border.secondary.base'),
      inactiveContentColor: theme.color('content.primary'),
    }),
    [theme]
  )

  const rowModifiers = useMemo(() => (testID ? [fillMaxWidth(), testIdModifier(testID)] : [fillMaxWidth()]), [testID])

  // Material reports a tap on the segment that is already selected too; iOS does not, and neither does this.
  const select = useCallback(
    (index: number) => {
      if (index === selectedIndex) {
        return
      }

      haptics.selection()
      onChange?.(index, values[index] ?? '')
    },
    [onChange, selectedIndex, values]
  )

  const row = (
    <SingleChoiceSegmentedButtonRow modifiers={rowModifiers}>
      {values.map((label, index) => (
        <SegmentedButton
          colors={colors}
          enabled={!disabled}
          key={index}
          modifiers={SEGMENT}
          onClick={() => select(index)}
          selected={index === selectedIndex}
        >
          <SegmentedButton.Label>
            <Text style={theme.typography.subheadlineMedium}>{label}</Text>
          </SegmentedButton.Label>
        </SegmentedButton>
      ))}
    </SingleChoiceSegmentedButtonRow>
  )

  if (insideHost) {
    return row
  }

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents={MATCH_HEIGHT_ONLY} seedColor={theme.materialSeed}>
      {row}
    </Host>
  )
}
