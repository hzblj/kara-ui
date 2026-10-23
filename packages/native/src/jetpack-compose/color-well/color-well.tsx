import {useCallback} from 'react'
import type {NativeSyntheticEvent} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {ColorWellComponent, ColorWellProps} from './color-well.types'

type NativeColorWellProps = Omit<ColorWellProps, 'onValueChange'> & {
  onValueChange: (event: NativeSyntheticEvent<{value: string}>) => void
}

const NativeColorWell = requireKaraView<NativeColorWellProps>('ColorWellView')

/**
 * The colour picker Compose does not ship, in the iOS picker's shape: a well with a rainbow ring that opens a sheet of
 * swatches, a spectrum and RGB sliders, with an opacity slider when asked for. Inside a Compose host.
 */
export const ColorWell: ColorWellComponent = ({onValueChange, ...props}: ColorWellProps) => {
  const handleValueChange = useCallback(
    (event: NativeSyntheticEvent<{value: string}>) => onValueChange?.(event.nativeEvent.value),
    [onValueChange]
  )

  return <NativeColorWell {...props} onValueChange={handleValueChange} />
}
