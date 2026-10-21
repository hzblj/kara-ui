import {useCallback} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {requireKaraView} from '../../require-view'
import type {NavigationBarProps} from './navigation-bar.types'

type NativeNavigationBarProps = {
  backLabel?: string
  backTestID?: string
  closeLabel?: string
  closeTestID?: string
  fontFamily?: string
  fontSize?: number
  itemColor: ColorValue
  onBack?: () => void
  onClose?: () => void
  showsBack: boolean
  showsClose: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
  title?: string
  titleColor: ColorValue
}

const NativeNavigationBar = requireKaraView<NativeNavigationBarProps>('NavigationBarView')

/** A standalone `UINavigationBar` whose back and close items press and render like a native-stack header's. */
export const NavigationBar = ({onBack, onClose, ...props}: NavigationBarProps) => {
  const handleBack = useCallback(() => onBack?.(), [onBack])
  const handleClose = useCallback(() => onClose?.(), [onClose])

  return (
    <NativeNavigationBar
      {...props}
      onBack={handleBack}
      onClose={handleClose}
      showsBack={onBack !== undefined}
      showsClose={onClose !== undefined}
    />
  )
}
