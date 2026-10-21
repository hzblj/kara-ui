import {SegmentedControl as NativeSegmentedControl} from '@expo/ui/community/segmented-control'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback} from 'react'

import type {SegmentedControlComponent, SegmentedControlProps} from './segmented-control.types'

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
      onChange?.(event.nativeEvent.selectedSegmentIndex, event.nativeEvent.value)
    },
    [onChange]
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
