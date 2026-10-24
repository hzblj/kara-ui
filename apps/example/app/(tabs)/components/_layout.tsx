import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'

import {catalogTitle} from '../../../src/catalog'

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
        options={({route}) => ({title: catalogTitle(route.params as {id?: string; shot?: string} | undefined)})}
      />
    </Stack>
  )
}
