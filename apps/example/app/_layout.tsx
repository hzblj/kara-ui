import {useAppTheme} from '@hzblj/kara-ui'
import {useStackScreenOptions} from '@hzblj/kara-ui/header'
import {withZoomTransition} from '@hzblj/kara-ui/router'
import {Stack} from 'expo-router'
import {Platform} from 'react-native'

import {photoTitle} from '../src/catalog'
import {Providers} from '../src/providers'

const RootStack = () => {
  const theme = useAppTheme()
  const stackScreenOptions = useStackScreenOptions()

  return (
    <Stack screenOptions={{contentStyle: {backgroundColor: theme.color('surface.base')}, headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      {/*
        Storybook brings its own chrome but no way out of itself, so this is the one screen that keeps a header. The
        back button shows the chevron alone: iOS labels it with the previous route's title by default, and the route
        it comes back to is a group, so the label would read "(tabs)".
      */}
      <Stack.Screen
        name="storybook"
        options={{headerBackButtonDisplayMode: 'minimal', headerShown: true, title: 'Storybook'}}
      />
      {/*
        The website's screenshots and recordings (`scripts/capture-shots.sh`). One instance whatever the id, so a run
        through every component replaces the shot on screen instead of stacking fifty of them, and no animation, so a
        deep link lands on the component rather than on a push half-way across.
      */}
      {/* The `useHeader` demo: kara's stack options, then the screen sets its own actions. */}
      <Stack.Screen name="header" options={{...stackScreenOptions, headerShown: true, title: 'Header'}} />
      <Stack.Screen dangerouslySingular={() => 'shot'} name="shot/[id]" options={{animation: 'none'}} />
      {/*
        The photo a ZoomTransition demo card grows into: a full-screen modal over the tabs, the way a gallery opens. No
        native header on iOS — a modal's bar lives in a nested stack, and the zoom would not reach the presented
        controller — so the page draws its own close; Android keeps Material's bar. On Android a push that zooms becomes
        a fade, so the container transform reads as the transition.
      */}
      <Stack.Screen
        name="photo/[id]"
        options={withZoomTransition(({route}) => ({
          headerShown: Platform.OS === 'android',
          presentation: 'fullScreenModal',
          title: photoTitle((route.params as {id?: string} | undefined)?.id),
        }))}
      />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <Providers>
      <RootStack />
    </Providers>
  )
}
