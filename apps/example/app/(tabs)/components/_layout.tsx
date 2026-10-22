import {useAppTheme} from '@hzblj/kara-ui'
import {withZoomTransition} from '@hzblj/kara-ui/router'
import {Stack} from 'expo-router'

import {catalogEntry, photoTitle} from '../../../src/catalog'

export default function ComponentsLayout() {
  const theme = useAppTheme()

  return (
    <Stack
      screenOptions={{
        contentStyle: {backgroundColor: theme.color('surface.base')},
        headerBackButtonDisplayMode: 'minimal',
        headerLargeTitle: true,
      }}
    >
      <Stack.Screen name="index" options={{title: 'Components'}} />
      <Stack.Screen
        name="[id]"
        options={({route}) => ({title: catalogEntry((route.params as {id?: string} | undefined)?.id)?.name ?? ''})}
      />
      {/* On Android a push that zooms becomes a fade, so the container transform reads as the transition. */}
      <Stack.Screen
        name="zoom/[id]"
        options={withZoomTransition(({route}) => ({
          headerLargeTitle: false,
          title: photoTitle((route.params as {id?: string} | undefined)?.id),
        }))}
      />
    </Stack>
  )
}
