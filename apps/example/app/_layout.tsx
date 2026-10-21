import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'

import {Providers} from '../src/providers'

const RootStack = () => {
  const theme = useAppTheme()

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
