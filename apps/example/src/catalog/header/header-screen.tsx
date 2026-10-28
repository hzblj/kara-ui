import {Button, Island, RnText, VStack} from '@hzblj/kara-ui'
import {type HeaderAction, useHeader, useHeaderSearch} from '@hzblj/kara-ui/header'
import {router, useNavigation} from 'expo-router'
import {useCallback, useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import Animated, {useAnimatedScrollHandler} from 'react-native-reanimated'

const COUNTRIES = [
  'Austria',
  'Belgium',
  'Croatia',
  'Czechia',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
]

const SHARE_DURATION = 1500

const styles = StyleSheet.create({
  controls: {padding: 20},
  row: {paddingHorizontal: 20, paddingVertical: 14},
})

const keyExtractor = (country: string) => country

const renderCountry = ({item}: {item: string}) => (
  <View style={styles.row}>
    <RnText variant="body">{item}</RnText>
  </View>
)

/**
 * A pushed screen whose whole header comes from `useHeader`: a large title (UIKit's on iOS, a collapsing first row on
 * Android) or a leading title with a subtitle, a search field, and every kind of action on both sides. The toggles in
 * the list change them live.
 */
export const HeaderScreen = () => {
  const navigation = useNavigation()
  const search = useHeaderSearch({placeholder: 'Search countries'})
  const [favourites, setFavourites] = useState(3)
  const [isSharing, setIsSharing] = useState(false)
  const [backHidden, setBackHidden] = useState(false)
  const [subtitleShown, setSubtitleShown] = useState(false)
  const [sortByName, setSortByName] = useState(true)

  const countries = useMemo(() => {
    const query = search.query.trim().toLowerCase()
    const found = COUNTRIES.filter(country => country.toLowerCase().includes(query))

    return sortByName ? found : found.slice().reverse()
  }, [search.query, sortByName])

  const share = useCallback(() => {
    setIsSharing(true)
    setTimeout(() => setIsSharing(false), SHARE_DURATION)
  }, [])

  const leadingActions = useMemo<HeaderAction[]>(
    () => [{label: 'Edit', onPress: () => undefined, testID: 'header-edit', type: 'text'}],
    []
  )

  const trailingActions = useMemo<HeaderAction[]>(() => {
    const actions: HeaderAction[] = [
      {icon: 'share', label: 'Share', loading: isSharing, onPress: share, testID: 'header-share', type: 'icon'},
      {
        badge: favourites,
        icon: 'heart',
        label: 'Favourites',
        onPress: () => setFavourites(count => count + 1),
        testID: 'header-favourites',
        type: 'icon',
      },
      {
        icon: 'more',
        items: [
          {
            inline: true,
            items: [
              {checked: sortByName, label: 'A to Z', onPress: () => setSortByName(true), type: 'action'},
              {checked: !sortByName, label: 'Z to A', onPress: () => setSortByName(false), type: 'action'},
            ],
            label: 'Sort',
            type: 'submenu',
          },
          {icon: 'settings', label: 'Settings', onPress: () => undefined, type: 'action'},
          {destructive: true, icon: 'trash', label: 'Delete', onPress: () => undefined, type: 'action'},
        ],
        label: 'More',
        separated: true,
        testID: 'header-more',
        title: 'Options',
        type: 'menu',
      },
    ]

    if (backHidden) {
      actions.push({onPress: () => router.back(), separated: true, testID: 'header-close', type: 'close'})
    }

    return actions
  }, [backHidden, favourites, isSharing, share, sortByName])

  const header = useHeader(navigation, {
    backHidden,
    largeTitle: !subtitleShown,
    leadingActions,
    search: search.searchBar,
    subtitle: subtitleShown ? `${countries.length} countries` : undefined,
    title: 'Countries',
    trailingActions,
  })

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      header.onScroll(event.contentOffset.y)
    },
  })

  const listHeader = (
    <>
      {header.largeTitle}
      {search.searchInput}
      <View style={styles.controls}>
        <Island>
          <VStack spacing="s12">
            <Button label="Share (spinner)" onPress={share} variant="secondary" />
            <Button
              label={subtitleShown ? 'Large title' : 'Leading title with a subtitle'}
              onPress={() => setSubtitleShown(shown => !shown)}
              variant="secondary"
            />
            <Button
              label={backHidden ? 'Show the back button' : 'Hide the back button'}
              onPress={() => setBackHidden(hidden => !hidden)}
              variant="secondary"
            />
          </VStack>
        </Island>
      </View>
    </>
  )

  return (
    <>
      <Animated.FlatList
        contentInsetAdjustmentBehavior={header.contentInsetAdjustmentBehavior}
        data={countries}
        keyboardDismissMode="on-drag"
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        onScroll={onScroll}
        renderItem={renderCountry}
        scrollEventThrottle={16}
      />
      {search.scrim}
    </>
  )
}
