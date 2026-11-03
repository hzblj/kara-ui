import {iconResourceName} from '@hzblj/expo-native-icons'
import {NavigationItemSearch} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {headerColor} from './header-color'
import type {HeaderSearchAccessoryComponent, HeaderSearchAccessoryProps} from './header-search-accessory.types'

/**
 * The toolbar search's glyphs and voice on Android (`integratedButton`): react-native-screens' `SearchView` belongs to
 * the toolbar, so a zero-size native view in the screen's tree puts the microphone into its field and gives its X the
 * bar's ripple and the app's clear glyph. The toolbar has no cancel glyph; back closes the search.
 */
export const HeaderSearchAccessory: HeaderSearchAccessoryComponent = ({
  clearIcon,
  voice,
}: HeaderSearchAccessoryProps) => {
  const theme = useAppTheme()
  const nativeVoice = useMemo(
    () =>
      voice && {
        ...voice,
        microphoneIconName: voice.microphoneIcon ? iconResourceName(voice.microphoneIcon) : undefined,
        stopIconName: voice.stopIcon ? iconResourceName(voice.stopIcon) : undefined,
      },
    [voice]
  )
  const fieldClearIcon = voice?.clearIcon ?? clearIcon

  return (
    <NavigationItemSearch
      clearIconName={fieldClearIcon ? iconResourceName(fieldClearIcon) : undefined}
      iconColor={voice?.color ?? headerColor(theme, 'content.primary')}
      rippleColor={theme.color('fill.ripple')}
      voice={nativeVoice}
    />
  )
}
