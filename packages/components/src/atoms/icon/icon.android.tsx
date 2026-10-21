import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import {RnView} from '../rn-view'
import type {IconComponent, IconProps} from './icon.types'
import {MATERIAL_ICONS} from './icon-names'

export const Icon: IconComponent = ({color = 'content.primary', name, size = 's24', testID}: IconProps) => {
  useHostGuard('Icon')
  const theme = useAppTheme()

  return (
    <RnView>
      <MaterialIcons color={theme.color(color)} name={MATERIAL_ICONS[name]} size={spacing[size]} testID={testID} />
    </RnView>
  )
}
