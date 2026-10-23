import {SegmentedControl as NativeSegmentedControl} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

/**
 * kara's own `UISegmentedControl`, with the pill in the accent and white text on it — the system control tints only the
 * pill, and SwiftUI's segmented picker not even that. A plain `UIView` in React Native layout: it needs no host, takes
 * the width it is given and UIKit's height. UIKit plays the control's own feedback.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  disabled = false,
  onChange,
  selectedIndex,
  testID,
  values,
}: SegmentedControlProps) => {
  const theme = useAppTheme()
  const face = theme.typography.footnoteMedium

  // The native control speaks in values; a segment's is its index, so two labels may read the same.
  const options = useMemo(() => values.map((label, index) => ({label, value: String(index)})), [values])

  const onValueChange = useCallback(
    (value: string) => {
      const index = Number(value)
      onChange?.(index, values[index] ?? '')
    },
    [onChange, values]
  )

  return (
    <NativeSegmentedControl
      activePillColor={theme.color('fill.accent.primary')}
      activeTextColor={theme.color('content.on.accent')}
      disabled={disabled}
      fontFamily={face.fontFamily}
      fontSize={face.fontSize}
      inactiveTextColor={theme.color('content.primary')}
      onValueChange={onValueChange}
      options={options}
      selectedValue={String(selectedIndex)}
      testID={testID}
    />
  )
}
