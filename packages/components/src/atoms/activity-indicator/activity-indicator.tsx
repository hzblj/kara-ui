import {useAppTheme} from '@hzblj/kara-theme'
import type {FC} from 'react'
import {type ActivityIndicatorProps, ActivityIndicator as RNActivityIndicator} from 'react-native'

export const ActivityIndicator: FC<ActivityIndicatorProps> = props => {
  const theme = useAppTheme()

  return <RNActivityIndicator color={theme.color('fill.accent.primary')} size="small" {...props} />
}
