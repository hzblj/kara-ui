import {iconResourceName} from '@hzblj/expo-native-icons'
import {GLYPHS} from '@hzblj/kara-native'
import {type SearchFieldRef, TopAppBar, type TopAppBarItem} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react'

import {Island} from '../../atoms/island'
import {BarSearchField, BarSearchRow} from './bar-search-field'
import type {NavigationBarComponent, NavigationBarItem, NavigationBarProps} from './navigation-bar.types'

/** Material's small top app bar. */
const BAR_HEIGHT = 64

const DEFAULT_LABELS = {back: 'Back', close: 'Close', search: 'Search'} as const

const NO_ITEMS: NavigationBarItem[] = []

const ignoreDetachedView = () => undefined

const toNativeItem = ({onPress, testID, ...item}: NavigationBarItem): TopAppBarItem =>
  item.type === 'icon'
    ? {iconName: iconResourceName(item.icon), label: item.label, onPress, testID, type: 'icon'}
    : {label: item.label ?? DEFAULT_LABELS[item.type], onPress, testID, type: item.type}

/**
 * Material's top app bar in its own host. `search` is a field in a row under the bar (`stacked`), or a search item
 * that grows into the field over the bar (`integratedButton`) and collapses back once the field is cancelled, cleared
 * or left empty. `separated` has no Material counterpart.
 */
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
  const font = theme.typography.headline
  const color = theme.color(inverted ? 'content.on.accent' : 'content.primary')

  const fieldRef = useRef<SearchFieldRef>(null)
  const query = useRef('')
  const echo = useRef<string | null>(null)
  const [searchActive, setSearchActive] = useState(false)

  const integrated = search?.placement === 'integratedButton'
  const buttonPlacement = search?.buttonPlacement ?? 'trailing'
  const onChangeText = search?.onChangeText
  const onFocusChange = search?.onFocusChange

  const searchItem = useMemo<TopAppBarItem | undefined>(
    () =>
      integrated
        ? {
            iconName: search?.buttonIcon ? iconResourceName(search.buttonIcon) : GLYPHS.search.android,
            label: search?.buttonLabel ?? DEFAULT_LABELS.search,
            onPress: () => setSearchActive(true),
            type: 'icon',
          }
        : undefined,
    [integrated, search?.buttonIcon, search?.buttonLabel]
  )

  const nativeLeadingItems = useMemo(() => {
    const items = (leadingItems ?? NO_ITEMS).map(toNativeItem)
    return searchItem && buttonPlacement === 'leading' ? [...items, searchItem] : items
  }, [buttonPlacement, leadingItems, searchItem])

  const nativeTrailingItems = useMemo(() => {
    const items = (trailingItems ?? NO_ITEMS).map(toNativeItem)
    return searchItem && buttonPlacement === 'trailing' ? [searchItem, ...items] : items
  }, [buttonPlacement, searchItem, trailingItems])

  const handleChangeText = useCallback(
    (text: string) => {
      query.current = text

      if (echo.current === text) {
        echo.current = null
        return
      }

      onChangeText?.(text)
    },
    [onChangeText]
  )

  const handleFocusChange = useCallback(
    (focused: boolean) => {
      onFocusChange?.(focused)

      if (!focused && query.current === '') {
        setSearchActive(false)
      }
    },
    [onFocusChange]
  )

  useImperativeHandle(
    search?.ref,
    () => ({
      clear: () => {
        fieldRef.current?.clearQuery().catch(ignoreDetachedView)
        fieldRef.current?.blurField().catch(ignoreDetachedView)
        setSearchActive(false)
      },
      setText: (text: string) => {
        echo.current = text
        query.current = text
        fieldRef.current?.setQuery(text).catch(ignoreDetachedView)
      },
    }),
    []
  )

  const field = search ? (
    <BarSearchField
      autoFocus={integrated}
      cancelLabel={search.cancelLabel}
      clearIcon={search.clearIcon}
      onChangeText={handleChangeText}
      onFocusChange={handleFocusChange}
      placeholder={search.placeholder}
      ref={fieldRef}
      testID={search.testID}
      voice={search.voice}
    />
  ) : null

  return (
    <>
      <Island h={BAR_HEIGHT} matchContents={false} testID={testID} w="100%">
        <TopAppBar
          fontFamily={font.fontFamily}
          fontSize={font.fontSize}
          itemColor={color}
          leadingItems={nativeLeadingItems}
          searchActive={integrated && searchActive}
          title={title}
          titleAlignment={titleAlignment}
          titleColor={color}
          titleVisible={titleVisible}
          trailingItems={nativeTrailingItems}
        >
          {integrated ? <TopAppBar.Search>{field}</TopAppBar.Search> : null}
        </TopAppBar>
      </Island>
      {search && !integrated ? <BarSearchRow>{field}</BarSearchRow> : null}
    </>
  )
}
