import {Host, SegmentedButton, SingleChoiceSegmentedButtonRow, Text} from '@expo/ui/jetpack-compose'
import {fillMaxWidth, testID as testIdModifier, weight} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {haptics} from '../../haptics'
import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/** Every segment the same width, like UIKit's: Material's would size each to its label. */
const SEGMENT = [weight(1)]

/**
 * Material's single-choice segmented buttons, the selected one filled with the accent like a checked `Switch`. Its own
 * host, themed like an `Island`, so it drops into React Native layout the way the iOS control does. Material plays
 * nothing on a new segment, so this plays `selection`.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  disabled = false,
  onChange,
  selectedIndex,
  testID,
  values,
}: SegmentedControlProps) => {
  const theme = useAppTheme()

  const colors = useMemo(
    () => ({
      activeBorderColor: theme.color('fill.accent.primary'),
      activeContainerColor: theme.color('fill.accent.primary'),
      activeContentColor: theme.color('content.on.accent'),
      disabledActiveBorderColor: theme.color('fill.accent.disabled'),
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

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents={MATCH_HEIGHT_ONLY} seedColor={theme.materialSeed}>
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
    </Host>
  )
}
