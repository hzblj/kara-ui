import {Image} from '@expo/ui/swift-ui'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import type {SFSymbol} from 'sf-symbols-typescript'
import {useHostGuard} from '../../host-context'
import type {IconComponent, IconProps} from './icon.types'
import {SF_SYMBOLS} from './icon-names'

export const Icon: IconComponent = ({color = 'content.primary', name, size = 's24', testID}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()

  return (
    <Image color={theme.color(color)} size={spacing[size]} systemName={SF_SYMBOLS[name] as SFSymbol} testID={testID} />
  )
}
