import {SegmentedControl as NativeSegmentedControl} from '@expo/ui/community/segmented-control'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback} from 'react'
import {Platform} from 'react-native'

import {haptics} from '../../haptics'
import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

/**
 * `UISegmentedControl` on iOS, Material's single-choice segmented buttons on Android. A new segment plays `selection`
 * on Android, whose buttons play nothing of their own; iOS 26's control already gives its own feedback.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  disabled = false,
  onChange,
  selectedIndex,
  testID,
  values,
}: SegmentedControlProps) => {
  const theme = useAppTheme()

  const onNativeChange = useCallback(
    (event: {nativeEvent: {selectedSegmentIndex: number; value: string}}) => {
      const index = event.nativeEvent.selectedSegmentIndex

      // Material reports a tap on the segment that is already selected too.
      if (Platform.OS === 'android' && index !== selectedIndex) {
        haptics.selection()
      }

      onChange?.(index, event.nativeEvent.value)
    },
    [onChange, selectedIndex]
  )

  return (
    <NativeSegmentedControl
      appearance={theme.dark ? 'dark' : 'light'}
      enabled={!disabled}
      onChange={onNativeChange}
      selectedIndex={selectedIndex}
      testID={testID}
      tintColor={theme.colorString('surface.primary')}
      values={values}
    />
  )
}
