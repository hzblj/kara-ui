import {Host, VStack} from '@expo/ui/swift-ui'
import {dynamicTypeSize} from '@expo/ui/swift-ui/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {MAX_DYNAMIC_TYPE_SIZE, useAppTheme} from '@hzblj/kara-theme'
import {StyleSheet} from 'react-native'
import {HostBoundary} from '../../host-context'
import type {ScreenComponent, ScreenProps} from './screen.types'

/**
 * Set on the host so it cascades through the SwiftUI environment to every native atom below. Capping rather than
 * opting out is Apple's own guidance — a capped layout still answers the setting, an opted-out one ignores the user.
 */
const DYNAMIC_TYPE_CAP = [dynamicTypeSize({max: MAX_DYNAMIC_TYPE_SIZE})]

export const Screen: ScreenComponent = ({bg = 'surface.base', children, ignoreKeyboardInset, testID}: ScreenProps) => {
  const theme = useAppTheme()
  const modifiers = useSxModifiers({bg, tall: true, wide: true})

  return (
    <Host
      colorScheme={theme.dark ? 'dark' : 'light'}
      ignoreSafeArea={ignoreKeyboardInset ? 'keyboard' : undefined}
      modifiers={DYNAMIC_TYPE_CAP}
      seedColor={theme.materialSeed}
      style={StyleSheet.absoluteFill}
      testID={testID}
    >
      <VStack modifiers={modifiers}>
        <HostBoundary>{children}</HostBoundary>
      </VStack>
    </Host>
  )
}
