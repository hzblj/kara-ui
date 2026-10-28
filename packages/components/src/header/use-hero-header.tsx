import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useEffect, useLayoutEffect, useMemo, useState} from 'react'
import {Platform} from 'react-native'
import {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {scheduleOnRN} from 'react-native-worklets'

import type {HeaderAction, HeaderNavigation, HeaderOptions, HeroHeader, HeroHeaderParams} from './header.types'
import {headerColor} from './header-color'
import {useIsTitleRevealed} from './header-title'
import {HeroHeaderBackground} from './hero-header-background'
import {useHeaderOptions} from './use-header'
import {useHeaderBarInset} from './use-header-bar-inset'
import {HERO_HEADER_SCREEN_OPTIONS} from './use-stack-screen-options'

/** The header fades in while 50 to 70 % of the hero's part under the bar scrolls away. */
const REVEAL_RANGE = [0.5, 0.7] as const

/** Material 3's top app bar. */
const ANDROID_BAR_HEIGHT = 64

const useHeroBarHeight = () => {
  const iosBarInset = useHeaderBarInset()
  const {top} = useSafeAreaInsets()

  return Platform.OS === 'ios' ? iosBarInset : top + ANDROID_BAR_HEIGHT
}

const useIsOverHero = (progress: SharedValue<number>) => {
  const [overHero, setOverHero] = useState(() => progress.value === 0)

  useAnimatedReaction(
    () => progress.value === 0,
    (isOver, wasOver) => {
      if (isOver !== wasOver) {
        scheduleOnRN(setOverHero, isOver)
      }
    }
  )

  return overHero
}

const useRevealProgress = (barHeight: number, heroHeight: number, introProgress?: SharedValue<number>) => {
  const scrollY = useSharedValue(0)
  const heroUnderBar = heroHeight - barHeight
  const start = heroUnderBar * REVEAL_RANGE[0]
  const end = heroUnderBar * REVEAL_RANGE[1]

  const scrollProgress = useDerivedValue(() => {
    if (end <= start) {
      return 1
    }

    return interpolate(scrollY.value, [start, end], [0, 1], Extrapolation.CLAMP)
  })

  const progress = useDerivedValue(() => Math.max(scrollProgress.value, introProgress?.value ?? 0))

  const onScroll = useCallback(
    (offsetY: number) => {
      'worklet'
      scrollY.value = offsetY
    },
    [scrollY]
  )

  return {onScroll, progress, scrollProgress}
}

/**
 * A header over a full-bleed hero: the content runs under a transparent bar, and while 50 to 70 % of the hero's part
 * under the bar scrolls away the header fades in — the title (and subtitle) in the bar, the bar's background
 * (`background`: iOS 26's scroll edge effect switched on, a fading material below iOS 26, the top app bar's surface on
 * Android) and the items' tint, light over the hero with `overHeroStyle` `light`. `revealedTrailingActions` join the
 * bar once the title is shown. Give the screen `HERO_HEADER_SCREEN_OPTIONS` as static options, so its first frame has
 * no large title, render `background` after the list and call `onScroll` with its offset.
 */
export const useHeroHeader = (
  navigation: HeaderNavigation,
  {
    backHidden,
    heroHeight,
    introProgress,
    leadingActions,
    overHeroStyle = 'light',
    revealedTrailingActions,
    subtitle,
    title,
    trailingActions,
  }: HeroHeaderParams
): HeroHeader => {
  const theme = useAppTheme()
  const barHeight = useHeroBarHeight()
  const {onScroll, progress, scrollProgress} = useRevealProgress(barHeight, heroHeight, introProgress)
  const titleShown = useIsTitleRevealed(scrollProgress)
  const overHero = useIsOverHero(progress)
  const scrolledOverHero = useIsOverHero(scrollProgress)

  const visibleTrailingActions = useMemo(() => {
    if (!titleShown || !revealedTrailingActions) {
      return trailingActions
    }

    const actions: HeaderAction[] = []

    for (const action of revealedTrailingActions) {
      actions.push(action)
    }

    for (const action of trailingActions ?? []) {
      actions.push(action)
    }

    return actions
  }, [revealedTrailingActions, titleShown, trailingActions])

  const {options} = useHeaderOptions({
    backHidden,
    leadingActions,
    subtitle,
    title,
    titleRevealProgress: scrollProgress,
    trailingActions: visibleTrailingActions,
  })

  useLayoutEffect(() => {
    navigation.setOptions(HERO_HEADER_SCREEN_OPTIONS)
  }, [navigation])

  useLayoutEffect(() => {
    navigation.setOptions(options)
  }, [navigation, options])

  useEffect(() => {
    const light = overHero && overHeroStyle === 'light'
    const appearance: HeaderOptions = {
      headerTintColor: headerColor(theme, light ? 'content.on.accent' : 'content.primary'),
    }

    if (isScrollEdgeEffectAvailable()) {
      appearance.scrollEdgeEffects = {top: scrolledOverHero ? 'hidden' : 'automatic'}
    }

    navigation.setOptions(appearance)
  }, [navigation, overHero, overHeroStyle, scrolledOverHero, theme])

  const background = useMemo(
    () => <HeroHeaderBackground height={barHeight} progress={progress} />,
    [barHeight, progress]
  )

  return {
    background,
    contentInsetAdjustmentBehavior: 'never',
    largeTitle: null,
    onScroll,
    progress,
    scrollProgress,
    statusBarStyle: overHero ? overHeroStyle : undefined,
  }
}
