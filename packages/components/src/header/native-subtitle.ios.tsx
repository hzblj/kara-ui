import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {NavigationItemSubtitle} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'

import type {NativeSubtitleComponent, NativeSubtitleProps} from './native-subtitle.types'

/** iOS 26 puts a title and its subtitle on the leading side itself (`UINavigationItem.style = .browser`). */
export const hasNativeSubtitle = isScrollEdgeEffectAvailable()

export const NativeSubtitle: NativeSubtitleComponent = ({subtitle, subtitleHidden}: NativeSubtitleProps) => {
  const theme = useAppTheme()

  return (
    <NavigationItemSubtitle
      color={theme.color('content.secondary')}
      fontFamily={theme.typography.label.fontFamily}
      fontSize={theme.typography.label.fontSize}
      subtitle={subtitle}
      subtitleHidden={subtitleHidden}
    />
  )
}
