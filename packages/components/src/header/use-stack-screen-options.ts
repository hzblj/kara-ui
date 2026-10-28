import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Platform} from 'react-native'

import type {StackScreenOptions} from './header.types'
import {headerColor} from './header-color'

/** iOS 26 draws its own scroll edge effect under a transparent bar; older iOS needs the bar's blur instead. */
const HEADER_BLUR_EFFECT =
  Platform.OS === 'ios' && !isScrollEdgeEffectAvailable() ? ('systemChromeMaterial' as const) : undefined

/**
 * A native stack's `screenOptions` in the active theme: the surface behind every screen, a minimal back button, the
 * title and large title in the theme's `headline` and `headingM`, no hairline under the bar. iOS keeps the bar
 * transparent so iOS 26 blurs what scrolls under it (older iOS gets the bar's material); Android gets a solid top app
 * bar in the surface colour.
 */
export const useStackScreenOptions = (): StackScreenOptions => {
  const theme = useAppTheme()

  return useMemo(() => {
    const content = headerColor(theme, 'content.primary')
    const surface = headerColor(theme, 'surface.base')

    return {
      contentStyle: {backgroundColor: surface},
      headerBackButtonDisplayMode: 'minimal',
      headerBlurEffect: HEADER_BLUR_EFFECT,
      headerLargeTitleShadowVisible: false,
      headerLargeTitleStyle: {
        color: content,
        fontFamily: theme.typography.headingM.fontFamily,
        fontSize: theme.typography.headingM.fontSize,
      },
      headerShadowVisible: false,
      headerStyle: Platform.OS === 'android' ? {backgroundColor: surface} : undefined,
      headerTintColor: content,
      headerTitleStyle: {
        color: content,
        fontFamily: theme.typography.headline.fontFamily,
        fontSize: theme.typography.headline.fontSize,
      },
      headerTransparent: Platform.OS === 'ios',
    }
  }, [theme])
}

/** A screen with a large title that collapses into the bar as its list scrolls. */
export const LARGE_TITLE_SCREEN_OPTIONS: StackScreenOptions = {headerLargeTitleEnabled: true, headerShown: true}

/** A screen without the stack's header, for one that draws its own or none. */
export const HIDDEN_HEADER_SCREEN_OPTIONS: StackScreenOptions = {headerShown: false}

/**
 * A screen whose content runs under a transparent bar, a full-bleed image above all, for `useHeroHeader`. Static, so the
 * first frame already has no large title and no bar background over the image.
 */
export const HERO_HEADER_SCREEN_OPTIONS: StackScreenOptions = {
  headerBlurEffect: 'none',
  headerLargeTitleEnabled: false,
  headerShown: true,
  headerStyle: {backgroundColor: 'transparent'},
  headerTransparent: true,
  scrollEdgeEffects: {top: 'hidden'},
}
