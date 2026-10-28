import {Image, RnText} from '@hzblj/kara-ui'
import {type HeaderAction, useHeroHeader} from '@hzblj/kara-ui/header'
import {useNavigation} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import Animated, {useAnimatedScrollHandler} from 'react-native-reanimated'

import {PHOTOS} from '../zoom/photos'

const HERO_HEIGHT = 460

const PARAGRAPHS = Array.from(
  {length: 8},
  () =>
    'The bar stays transparent over the photo. Once most of the photo has scrolled under it, the title, the subtitle and the bar fade in, and the heart joins the share item.'
)

const styles = StyleSheet.create({
  body: {gap: 16, padding: 20},
})

/** A hero header over a full-bleed photo, from `useHeroHeader`. */
export const HeroScreen = () => {
  const navigation = useNavigation()
  const [favourite, setFavourite] = useState(false)

  const trailingActions = useMemo<HeaderAction[]>(
    () => [{icon: 'share', label: 'Share', onPress: () => undefined, testID: 'hero-share', type: 'icon'}],
    []
  )

  const revealedTrailingActions = useMemo<HeaderAction[]>(
    () => [
      {
        color: favourite ? 'content.destructive' : undefined,
        icon: 'heart',
        label: 'Favourite',
        onPress: () => setFavourite(value => !value),
        separated: true,
        testID: 'hero-favourite',
        type: 'icon',
      },
    ],
    [favourite]
  )

  const hero = useHeroHeader(navigation, {
    heroHeight: HERO_HEIGHT,
    revealedTrailingActions,
    subtitle: 'Iceland',
    title: 'Northern lights',
    trailingActions,
  })

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      hero.onScroll(event.contentOffset.y)
    },
  })

  return (
    <>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior={hero.contentInsetAdjustmentBehavior}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Image contentFit="cover" h={HERO_HEIGHT} source={{uri: PHOTOS[0]?.uri}} />
        <View style={styles.body}>
          {PARAGRAPHS.map((paragraph, index) => (
            <RnText color="content.secondary" key={index} variant="body">
              {paragraph}
            </RnText>
          ))}
        </View>
      </Animated.ScrollView>
      {hero.background}
      <StatusBar style={hero.statusBarStyle ?? 'auto'} />
    </>
  )
}
