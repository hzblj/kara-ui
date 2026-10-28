import {type ReactNode, useCallback, useMemo, useState} from 'react'
import {type LayoutChangeEvent, Platform, StyleSheet, useWindowDimensions, View} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import {scheduleOnRN} from 'react-native-worklets'

import {RnText} from '../atoms/rn-text'
import type {HeaderOptions} from './header.types'
import {hasNativeSubtitle, NativeSubtitle} from './native-subtitle'

/** Past half, a revealed title counts as shown: the native title and subtitle switch then. */
const REVEALED_THRESHOLD = 0.5

/** iOS centres a custom title view in what the bar items leave; this much stays for them on a leading title. */
const LEADING_TITLE_RESERVED_WIDTH = 200

const styles = StyleSheet.create({
  largeTitle: {paddingHorizontal: 16, paddingVertical: 8},
  leadingTitleAndroid: {paddingStart: 2, paddingTop: 1},
  leadingTitleIos: {flexShrink: 1, paddingTop: 1},
  shrink: {flexShrink: 1},
})

export const useIsTitleRevealed = (progress?: SharedValue<number>) => {
  const [revealed, setRevealed] = useState(() => progress === undefined || progress.value > REVEALED_THRESHOLD)

  useAnimatedReaction(
    () => progress === undefined || progress.value > REVEALED_THRESHOLD,
    (isRevealed, wasRevealed) => {
      if (isRevealed !== wasRevealed) {
        scheduleOnRN(setRevealed, isRevealed)
      }
    }
  )

  return revealed
}

const Reveal = ({children, progress}: {children: ReactNode; progress: SharedValue<number>}) => {
  const animatedStyle = useAnimatedStyle(() => ({opacity: progress.value}))

  return <Animated.View style={[styles.shrink, animatedStyle]}>{children}</Animated.View>
}

const BarTitle = ({title}: {title: string}) => (
  <RnText accessibilityRole="header" allowFontScaling={false} numberOfLines={1} variant="headline">
    {title}
  </RnText>
)

const LeadingTitle = ({subtitle, title}: {subtitle: string; title: string}) => {
  const {width} = useWindowDimensions()
  const content = (
    <>
      <RnText accessibilityRole="header" allowFontScaling={false} numberOfLines={1} variant="subheadlineMedium">
        {title}
      </RnText>
      <RnText allowFontScaling={false} color="content.secondary" numberOfLines={1} variant="label">
        {subtitle}
      </RnText>
    </>
  )

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.leadingTitleIos, {width}]}>
        <View style={{maxWidth: width - LEADING_TITLE_RESERVED_WIDTH}}>{content}</View>
      </View>
    )
  }

  return <View style={[styles.leadingTitleAndroid, {maxWidth: width - LEADING_TITLE_RESERVED_WIDTH}]}>{content}</View>
}

const LargeTitle = ({height, title}: {height: SharedValue<number>; title: string}) => {
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      height.value = event.nativeEvent.layout.height
    },
    [height]
  )

  return (
    <View onLayout={onLayout} style={styles.largeTitle}>
      <RnText accessibilityRole="header" allowFontScaling={false} numberOfLines={1} variant="headingM">
        {title}
      </RnText>
    </View>
  )
}

const CollapsingTitle = ({
  height,
  scrollY,
  title,
}: {
  height: SharedValue<number>
  scrollY: SharedValue<number>
  title: string
}) => {
  const progress = useDerivedValue(() => {
    if (height.value === 0) {
      return 0
    }

    return interpolate(scrollY.value, [height.value / 2, height.value], [0, 1], Extrapolation.CLAMP)
  })

  return (
    <Reveal progress={progress}>
      <BarTitle title={title} />
    </Reveal>
  )
}

type TitleParams = {
  largeTitle?: boolean
  subtitle?: string
  title?: string
  titleHidden: boolean
  titleRevealProgress?: SharedValue<number>
}

/**
 * The title half of a header: the options that show the title (centred, leading with a subtitle, revealed on scroll or
 * large), plus on Android the large title row and the scroll worklet that collapses it into the bar, as Material's large
 * top app bar does. iOS needs neither: the large title is UIKit's own.
 */
export const useHeaderTitle = ({largeTitle, subtitle, title, titleHidden, titleRevealProgress}: TitleParams) => {
  const scrollY = useSharedValue(0)
  const largeTitleHeight = useSharedValue(0)
  const revealed = useIsTitleRevealed(titleRevealProgress)
  const isAndroidLargeTitle = Platform.OS === 'android' && largeTitle === true && !!title

  const onScroll = useCallback(
    (offsetY: number) => {
      'worklet'
      scrollY.value = offsetY
    },
    [scrollY]
  )

  const options = useMemo((): HeaderOptions => {
    const titleOptions: HeaderOptions = {}

    if (largeTitle !== undefined) {
      titleOptions.headerLargeTitleEnabled = Platform.OS === 'ios' && largeTitle
    }

    if (title === undefined) {
      return titleOptions
    }

    titleOptions.title = title

    if (titleHidden) {
      titleOptions.headerTitle = ''
      return titleOptions
    }

    if (subtitle !== undefined && hasNativeSubtitle) {
      const shownTitle = revealed ? title : ''

      // The subtitle styles the screen's navigation item from inside its tree, which `headerBackground` is.
      titleOptions.headerBackground = () => <NativeSubtitle subtitle={subtitle} subtitleHidden={!revealed} />
      titleOptions.headerTitle = shownTitle
      titleOptions.title = shownTitle
      return titleOptions
    }

    if (subtitle !== undefined) {
      const leadingTitle = <LeadingTitle subtitle={subtitle} title={title} />

      titleOptions.headerTitle = () =>
        titleRevealProgress ? <Reveal progress={titleRevealProgress}>{leadingTitle}</Reveal> : leadingTitle
      return titleOptions
    }

    if (titleRevealProgress) {
      titleOptions.headerTitle = () => (
        <Reveal progress={titleRevealProgress}>
          <BarTitle title={title} />
        </Reveal>
      )
      return titleOptions
    }

    if (isAndroidLargeTitle) {
      titleOptions.headerTitle = () => <CollapsingTitle height={largeTitleHeight} scrollY={scrollY} title={title} />
      return titleOptions
    }

    titleOptions.headerTitle = title
    return titleOptions
  }, [
    isAndroidLargeTitle,
    largeTitle,
    largeTitleHeight,
    revealed,
    scrollY,
    subtitle,
    title,
    titleHidden,
    titleRevealProgress,
  ])

  const largeTitleRow = useMemo(
    () => (isAndroidLargeTitle && title ? <LargeTitle height={largeTitleHeight} title={title} /> : null),
    [isAndroidLargeTitle, largeTitleHeight, title]
  )

  return {largeTitle: largeTitleRow, onScroll, options, revealed}
}
