import {iconResourceName} from '@hzblj/kara-native'
import {TopAppBar, type TopAppBarItem} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Island} from '../../atoms/island'
import type {NavigationBarComponent, NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

/** Material's small top app bar. */
const BAR_HEIGHT = 64

const DEFAULT_LABELS = {back: 'Back', close: 'Close'} as const

const toNativeItem = ({onPress, testID, ...item}: NavigationBarItem): TopAppBarItem =>
  item.type === 'icon'
    ? {iconName: iconResourceName(item.icon), label: item.label, onPress, testID, type: 'icon'}
    : {label: item.label ?? DEFAULT_LABELS[item.type], onPress, testID, type: item.type}

/** Material's top app bar in its own host. `search` is iOS-only for now, and `separated` has no Material counterpart. */
export const NavigationBar: NavigationBarComponent = ({
  inverted = false,
  leadingItems,
  testID,
  title,
  titleAlignment = 'center',
  titleVisible = true,
  trailingItems,
}: NavigationBarProps) => {
  const theme = useAppTheme()
  const font = theme.typography.headline
  const color = theme.color(inverted ? 'content.on.bg' : 'content.primary')

  const nativeLeadingItems = useMemo(() => leadingItems?.map(toNativeItem), [leadingItems])
  const nativeTrailingItems = useMemo(() => trailingItems?.map(toNativeItem), [trailingItems])

  return (
    <Island h={BAR_HEIGHT} matchContents={false} testID={testID} w="100%">
      <TopAppBar
        fontFamily={font.fontFamily}
        fontSize={font.fontSize}
        itemColor={color}
        leadingItems={nativeLeadingItems}
        title={title}
        titleAlignment={titleAlignment}
        titleColor={color}
        titleVisible={titleVisible}
        trailingItems={nativeTrailingItems}
      />
    </Island>
  )
}
