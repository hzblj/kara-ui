import {RNHostView} from '@expo/ui/swift-ui'
import {SegmentedControl as NativeSegmentedControl} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/**
 * kara's own `UISegmentedControl`, with the pill in the accent and white text on it — the system control tints only the
 * pill, and SwiftUI's segmented picker not even that. A plain `UIView` in React Native layout: it needs no host, takes
 * the width it is given and UIKit's height. Inside a `Screen` or `Island` it is carried into that host by `RNHostView`
 * (see `useInsideHost`), the host's width and its own height. UIKit plays the control's own feedback.
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

  const control = (
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

  return insideHost ? <RNHostView matchContents={MATCH_HEIGHT_ONLY}>{control}</RNHostView> : control
}
