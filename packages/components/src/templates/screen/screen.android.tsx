import {Column, Host} from '@expo/ui/jetpack-compose'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {StyleSheet} from 'react-native'
import {HostBoundary} from '../../host-context'
import type {ScreenComponent, ScreenProps} from './screen.types'

export const Screen: ScreenComponent = ({bg = 'surface.base', children, ignoreKeyboardInset, testID}: ScreenProps) => {
  const theme = useAppTheme()
  const modifiers = useSxModifiers({bg, tall: true, wide: true})

  return (
    <Host
      colorScheme={theme.dark ? 'dark' : 'light'}
      ignoreSafeAreaKeyboardInsets={ignoreKeyboardInset}
      seedColor={theme.materialSeed}
      style={StyleSheet.absoluteFill}
    >
      <Column modifiers={modifiers}>
        <HostBoundary>{children}</HostBoundary>
      </Column>
    </Host>
  )
}
