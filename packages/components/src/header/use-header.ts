import {useAppTheme} from '@hzblj/kara-theme'
import {useLayoutEffect, useMemo} from 'react'

import type {HeaderNavigation, HeaderOptions, HeaderParams} from './header.types'
import {toHeaderOptions} from './header-options'

/**
 * The native-stack options that draw a screen's header actions: the navigation bar's own items on iOS, Material buttons
 * in the top app bar on Android. Spread them into Expo Router's `<Stack.Screen options>` or a React Navigation screen's
 * `options`. Memoize the action arrays: new arrays build new options on every render.
 */
export const useHeaderOptions = ({backHidden, leadingActions, trailingActions}: HeaderParams): HeaderOptions => {
  const theme = useAppTheme()

  return useMemo(
    () => toHeaderOptions({backHidden, leadingActions, trailingActions}, theme),
    [backHidden, leadingActions, theme, trailingActions]
  )
}

/**
 * Sets the screen's header actions through its navigation object, from React Navigation's or Expo Router's
 * `useNavigation()`, before the screen first paints. Actions a screen has from the moment it is pushed belong in its
 * static `options` instead: iOS morphs the bar items between screens only when they exist at the push.
 */
export const useHeader = (navigation: HeaderNavigation, params: HeaderParams) => {
  const options = useHeaderOptions(params)

  useLayoutEffect(() => {
    navigation.setOptions(options)
  }, [navigation, options])
}
