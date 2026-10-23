import {iconResourceName} from '@hzblj/kara-native'
import {
  NavigationBar as NativeNavigationBar,
  type NavigationBarItem as NativeNavigationBarItem,
  type NavigationBarRef,
} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {useImperativeHandle, useMemo, useRef} from 'react'
import {StyleSheet} from 'react-native'
import type {NavigationBarComponent, NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

/** Fits iOS 26's 44 pt glass items with the bar's own margin; the bar centres itself vertically in it. */
const BAR_HEIGHT = 56

const styles = StyleSheet.create({
  bar: {height: BAR_HEIGHT, width: '100%'},
})

const DEFAULT_LABELS = {back: 'Back', close: 'Close'} as const

const toNativeItem = (item: NavigationBarItem): NativeNavigationBarItem =>
  item.type === 'icon'
    ? {...item, imageName: iconResourceName(item.icon), type: 'icon'}
    : {...item, label: item.label ?? DEFAULT_LABELS[item.type]}

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
    () => ({clear: () => barRef.current?.clearSearchText().catch(ignoreDetachedView)}),
    []
  )

  const nativeLeadingItems = useMemo(() => leadingItems?.map(toNativeItem), [leadingItems])
  const nativeTrailingItems = useMemo(() => trailingItems?.map(toNativeItem), [trailingItems])

  return (
    <NativeNavigationBar
      fontFamily={font.fontFamily}
      fontSize={font.fontSize}
      itemColor={color}
      leadingItems={nativeLeadingItems}
      onSearchFocusChange={search?.onFocusChange}
      onSearchTextChange={search?.onChangeText}
      ref={barRef}
      searchPlaceholder={search?.placeholder}
      searchTestID={search?.testID}
      style={styles.bar}
      testID={testID}
      title={title}
      titleAlignment={titleAlignment}
      titleColor={color}
      titleVisible={titleVisible}
      trailingItems={nativeTrailingItems}
    />
  )
}
