import {useAppTheme} from '@hzblj/kara-theme'
import {useLayoutEffect, useMemo} from 'react'

import type {HeaderContent, HeaderNavigation, HeaderOptions, HeaderOptionsResult, HeaderParams} from './header.types'
import {toHeaderOptions} from './header-options'
import {useHeaderTitle} from './header-title'

/**
 * A screen's header as native-stack options, with what its list needs alongside: the title (centred, leading with a
 * subtitle, revealed on scroll or large), the actions on both sides (the navigation bar's own items on iOS, Material
 * buttons on Android) and a search field. Spread `options` into Expo Router's `<Stack.Screen options>` or a React
 * Navigation screen's `options`. Memoize the action arrays: new arrays build new options on every render.
 */
export const useHeaderOptions = ({
  backHidden,
  largeTitle,
  leadingActions,
  search,
  subtitle,
  title,
  titleHidden = false,
  titleRevealProgress,
  trailingActions,
}: HeaderParams): HeaderOptionsResult => {
  const theme = useAppTheme()
  const headerTitle = useHeaderTitle({largeTitle, subtitle, title, titleHidden, titleRevealProgress})

  const actionOptions = useMemo(
    () => toHeaderOptions({backHidden, leadingActions, trailingActions}, theme),
    [backHidden, leadingActions, theme, trailingActions]
  )

  return useMemo(() => {
    const options: HeaderOptions = {}

    Object.assign(options, headerTitle.options, actionOptions)

    if (search) {
      options.headerSearchBarOptions = search
    }

    return {
      contentInsetAdjustmentBehavior: 'automatic',
      largeTitle: headerTitle.largeTitle,
      onScroll: headerTitle.onScroll,
      options,
    }
  }, [actionOptions, headerTitle.largeTitle, headerTitle.onScroll, headerTitle.options, search])
}

/**
 * Sets the screen's header through its navigation object, from React Navigation's or Expo Router's `useNavigation()`,
 * before the screen first paints, and returns what its list needs. What a screen has from the moment it is pushed
 * belongs in its static `options` too: iOS morphs the bar items between screens only when they exist at the push.
 */
export const useHeader = (navigation: HeaderNavigation, params: HeaderParams): HeaderContent => {
  const {contentInsetAdjustmentBehavior, largeTitle, onScroll, options} = useHeaderOptions(params)

  useLayoutEffect(() => {
    navigation.setOptions(options)
  }, [navigation, options])

  return useMemo(
    () => ({contentInsetAdjustmentBehavior, largeTitle, onScroll}),
    [contentInsetAdjustmentBehavior, largeTitle, onScroll]
  )
}
