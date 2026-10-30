import type {NavigationTitleTransition} from '@hzblj/kara-native'
import type {ReactNode} from 'react'

export type NativeSubtitleProps = {
  subtitle: string
  subtitleHidden: boolean
  transition?: NavigationTitleTransition
}

export type NativeSubtitleComponent = (props: NativeSubtitleProps) => ReactNode
