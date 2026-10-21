import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'

export default function GalleryLayout() {
  const theme = useAppTheme()

  return (
    <Stack
      screenOptions={{
        contentStyle: {backgroundColor: theme.color('surface.base')},
        headerLargeTitle: true,
        title: 'Gallery',
      }}
    />
  )
}
