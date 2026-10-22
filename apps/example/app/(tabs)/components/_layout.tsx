import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'

import {catalogEntry} from '../../../src/catalog'

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
    </Stack>
  )
}
