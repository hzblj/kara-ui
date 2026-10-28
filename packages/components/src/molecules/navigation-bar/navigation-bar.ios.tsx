import {iconResourceName} from '@hzblj/expo-native-icons'
import {
  NavigationBar as NativeNavigationBar,
  type NavigationBarItem as NativeNavigationBarItem,
  type NavigationBarRef,
} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {useImperativeHandle, useMemo, useRef} from 'react'
import {StyleSheet} from 'react-native'
import type {IconName} from '../../atoms/icon'
import {SEARCH_ROW_HEIGHT} from './navigation-bar.constants'
import type {NavigationBarComponent, NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

/** Fits iOS 26's 44 pt glass items with the bar's own margin; the bar centres its item row vertically in it. */
const BAR_HEIGHT = 56

const styles = StyleSheet.create({
  bar: {height: BAR_HEIGHT, width: '100%'},
  stackedSearchBar: {height: BAR_HEIGHT + SEARCH_ROW_HEIGHT, width: '100%'},
})

const DEFAULT_LABELS = {back: 'Back', cancel: 'Cancel', close: 'Close', search: 'Search'} as const

const toImageName = (icon?: IconName) => (icon ? iconResourceName(icon) : undefined)

const toNativeItem = (item: NavigationBarItem): NativeNavigationBarItem =>
  item.type === 'icon'
    ? {...item, imageName: iconResourceName(item.icon), type: 'icon'}
    : {...item, imageName: toImageName(item.icon), label: item.label ?? DEFAULT_LABELS[item.type]}

const ignoreDetachedView = () => undefined

export const NavigationBar: NavigationBarComponent = ({
  inverted = false,
  leadingItems,
  search,
  testID,
  title,
  titleAlignment = 'center',
  titleVisible = true,
  trailingItems,
}: NavigationBarProps) => {
  const theme = useAppTheme()
  const barRef = useRef<NavigationBarRef>(null)
  const font = theme.typography.headline
  const color = theme.color(inverted ? 'content.on.accent' : 'content.primary')

  useImperativeHandle(
    search?.ref,
    () => ({
      clear: () => barRef.current?.clearSearchText().catch(ignoreDetachedView),
      setText: (text: string) => barRef.current?.setSearchText(text).catch(ignoreDetachedView),
    }),
    []
  )

  const voice = search?.voice
  const clearIcon = search?.clearIcon
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

  const nativeLeadingItems = useMemo(() => leadingItems?.map(toNativeItem), [leadingItems])
  const nativeTrailingItems = useMemo(() => trailingItems?.map(toNativeItem), [trailingItems])
  const isStackedSearch = !!search && search.placement !== 'integratedButton'

  return (
    <NativeNavigationBar
      fontFamily={font.fontFamily}
      fontSize={font.fontSize}
      itemColor={color}
      leadingItems={nativeLeadingItems}
      onSearchFocusChange={search?.onFocusChange}
      onSearchTextChange={search?.onChangeText}
      ref={barRef}
      searchButtonImageName={toImageName(search?.buttonIcon)}
      searchButtonLabel={search ? (search.buttonLabel ?? DEFAULT_LABELS.search) : undefined}
      searchCancelImageName={toImageName(search?.cancelIcon)}
      searchCancelLabel={search ? (search.cancelLabel ?? DEFAULT_LABELS.cancel) : undefined}
      searchClearImageName={toImageName(clearIcon)}
      searchPlaceholder={search?.placeholder}
      searchPlacement={search?.placement}
      searchTestID={search?.testID}
      searchVoice={nativeVoice}
      style={isStackedSearch ? styles.stackedSearchBar : styles.bar}
      testID={testID}
      title={title}
      titleAlignment={titleAlignment}
      titleColor={color}
      titleVisible={titleVisible}
      trailingItems={nativeTrailingItems}
    />
  )
}
