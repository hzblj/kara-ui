import {RNHostView} from '@expo/ui/swift-ui'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {SegmentedControl as NativeSegmentedControl} from '@hzblj/kara-native/swift-ui'
import {spacing as spacingTokens, useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'
import {imageUri, segmentOf} from './segments'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/**
 * kara's own `UISegmentedControl`, with the pill in the accent and white text on it — the system control tints only the
 * pill, and SwiftUI's segmented picker not even that. A plain `UIView` in React Native layout: it needs no host, takes
 * the width it is given and UIKit's height. Inside a `Screen` or `Island` it is carried into that host by `RNHostView`
 * (see `useInsideHost`), the host's width and its own height. UIKit plays the control's own feedback. A segment shows a
 * title or an image, never both, so an icon segment is drawn natively as one image of the icon and the label, in the
 * label's colour; an image segment is the image alone, loaded and drawn by kara-native at `iconSize`.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  disabled = false,
  iconSize = 's20',
  onChange,
  selectedIndex,
  spacing,
  testID,
  values,
}: SegmentedControlProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const face = theme.typography.footnoteMedium

  const segments = useMemo(() => values.map(segmentOf), [values])

  // The native control speaks in values; a segment's is its index, so two labels may read the same.
  const options = useMemo(
    () =>
      segments.map((segment, index) => ({
        icon: segment.icon ? iconResourceName(segment.icon) : undefined,
        image: imageUri(segment.image),
        label: segment.label,
        value: String(index),
      })),
    [segments]
  )

  const onValueChange = useCallback(
    (value: string) => {
      const index = Number(value)
      onChange?.(index, segments[index]?.label ?? '')
    },
    [onChange, segments]
  )

  const control = (
    <NativeSegmentedControl
      activePillColor={theme.color('fill.accent.primary')}
      activeTextColor={theme.color('content.on.accent')}
      disabled={disabled}
      fontFamily={face.fontFamily}
      fontSize={face.fontSize}
      iconSize={spacingTokens[iconSize]}
      inactiveTextColor={theme.color('content.primary')}
      onValueChange={onValueChange}
      options={options}
      selectedValue={String(selectedIndex)}
      testID={testID}
      verticalPadding={spacing === undefined ? undefined : spacingTokens[spacing]}
    />
  )

  return insideHost ? <RNHostView matchContents={MATCH_HEIGHT_ONLY}>{control}</RNHostView> : control
}
