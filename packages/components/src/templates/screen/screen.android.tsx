import {Column, Host} from '@expo/ui/jetpack-compose'
import {padding} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useRef, useState} from 'react'
import {StatusBar, StyleSheet, View} from 'react-native'
import {HostBoundary} from '../../host-context'
import type {ScreenComponent, ScreenProps} from './screen.types'

/**
 * The content keeps clear of as much of the status bar as the screen covers — all of it when nothing sits above the
 * screen, none under a navigation bar — the way a SwiftUI host keeps to the safe area. Compose would draw under it:
 * the app is edge to edge, and `Host` pads for nothing. The background still runs to the edge.
 */
export const Screen: ScreenComponent = ({bg = 'surface.base', children, ignoreKeyboardInset, testID}: ScreenProps) => {
  const theme = useAppTheme()
  const frame = useRef<View>(null)
  const [statusBarOverlap, setStatusBarOverlap] = useState(0)
  const sx = useSxModifiers({bg, tall: true, wide: true})
  const modifiers = useMemo(
    () => (statusBarOverlap > 0 ? [...sx, padding(0, statusBarOverlap, 0, 0)] : sx),
    [statusBarOverlap, sx]
  )

  const onLayout = useCallback(() => {
    frame.current?.measureInWindow((_x, y) => {
      setStatusBarOverlap(Math.max(0, Math.round((StatusBar.currentHeight ?? 0) - y)))
    })
  }, [])

  return (
    <View onLayout={onLayout} ref={frame} style={StyleSheet.absoluteFill} testID={testID}>
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
    </View>
  )
}
