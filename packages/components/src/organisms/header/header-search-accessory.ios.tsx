import {iconResourceName} from '@hzblj/expo-native-icons'
import {NavigationItemSearch} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import type {IconName} from '../../atoms/icon'
import {headerColor} from './header-color'
import type {HeaderSearchAccessoryComponent, HeaderSearchAccessoryProps} from './header-search-accessory.types'

const toImageName = (icon?: IconName) => (icon ? iconResourceName(icon) : undefined)

/**
 * The header search field's glyphs and voice on iOS: react-native-screens' search bar belongs to the navigation item,
 * so a layout-less native view in the screen's tree dresses it.
 */
export const HeaderSearchAccessory: HeaderSearchAccessoryComponent = ({
  cancelIcon,
  clearIcon,
  voice,
}: HeaderSearchAccessoryProps) => {
  const theme = useAppTheme()
  const color = headerColor(theme, 'content.primary')
  const nativeVoice = useMemo(
    () =>
      voice && {
        ...voice,
        clearImageName: toImageName(voice.clearIcon ?? clearIcon),
        color: voice.color ?? color,
        microphoneImageName: toImageName(voice.microphoneIcon),
        stopImageName: toImageName(voice.stopIcon),
      },
    [clearIcon, color, voice]
  )

  return (
    <NavigationItemSearch
      cancelImageName={toImageName(cancelIcon)}
      clearImageName={toImageName(clearIcon)}
      voice={nativeVoice}
    />
  )
}
