import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'

import {designPage} from '../../../src/design'

export default function DesignLayout() {
  const theme = useAppTheme()

  return (
    <Stack
      screenOptions={{
        contentStyle: {backgroundColor: theme.color('surface.base')},
        headerBackButtonDisplayMode: 'minimal',
        headerLargeTitle: true,
      }}
    >
      <Stack.Screen name="index" options={{title: 'Design'}} />
      <Stack.Screen
        name="[id]"
        options={({route}) => ({title: designPage((route.params as {id?: string} | undefined)?.id)?.title ?? ''})}
      />
    </Stack>
  )
}
