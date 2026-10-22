import {useCallback} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {SegmentedControlProps} from './segmented-control.types'

type NativeSegmentedControlProps = Omit<SegmentedControlProps, 'onValueChange'> & {
  onValueChange: (event: NativeSyntheticEvent<{value: string}>) => void
}

const NativeSegmentedControl = requireKaraView<NativeSegmentedControlProps>('SegmentedControlView')

/**
 * A `UISegmentedControl` with every colour set from outside — the selected pill, both labels, the track — which the
 * system control and SwiftUI's segmented picker do not allow. A plain `UIView`: it needs no host.
 */
export const SegmentedControl = ({onValueChange, ...props}: SegmentedControlProps) => {
  const handleValueChange = useCallback(
    (event: NativeSyntheticEvent<{value: string}>) => onValueChange(event.nativeEvent.value),
    [onValueChange]
  )

  return <NativeSegmentedControl {...props} onValueChange={handleValueChange} />
}
