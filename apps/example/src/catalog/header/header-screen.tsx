import {Box, Button, Island, RnScrollView, RnText, VStack} from '@hzblj/kara-ui'
import {type HeaderAction, HeaderInset, useHeader} from '@hzblj/kara-ui/header'
import {router, useNavigation} from 'expo-router'
import {useCallback, useMemo, useState} from 'react'

const SHARE_DURATION = 1500

/**
 * A pushed screen whose header is built by `useHeader`: the same actions draw the navigation bar's own items on iOS and
 * Material buttons on Android. Every side and kind of action is here, and the toggles below change them live.
 */
export const HeaderScreen = () => {
  const navigation = useNavigation()
  const [favourites, setFavourites] = useState(3)
  const [isSharing, setIsSharing] = useState(false)
  const [backHidden, setBackHidden] = useState(false)
  const [sortByName, setSortByName] = useState(true)

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
              {checked: sortByName, label: 'By name', onPress: () => setSortByName(true), type: 'action'},
              {checked: !sortByName, label: 'By date', onPress: () => setSortByName(false), type: 'action'},
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

  useHeader(navigation, {backHidden, leadingActions, trailingActions})

  return (
    <RnScrollView contentInsetAdjustmentBehavior="automatic">
      <HeaderInset />
      <Box gap="s16" p="s20">
        <RnText color="content.secondary" variant="body">
          Leading, a text action. Trailing, an icon that turns into a spinner, an icon with a badge (iOS 26) and a menu
          with an inline section, in its own glass. Hiding the back button adds a close, which Android moves to the
          navigation icon.
        </RnText>
        <Island>
          <VStack spacing="s12">
            <Button label="Share (spinner)" onPress={share} variant="secondary" />
            <Button
              label={backHidden ? 'Show the back button' : 'Hide the back button'}
              onPress={() => setBackHidden(hidden => !hidden)}
              variant="secondary"
            />
          </VStack>
        </Island>
      </Box>
    </RnScrollView>
  )
}
