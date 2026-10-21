import {IconButton as ComposeIconButton} from '@expo/ui/jetpack-compose'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {IconButtonComponent, IconButtonProps} from './icon-button.types'

export const IconButton: IconButtonComponent = ({disabled = false, name, onPress}: IconButtonProps) => {
  useHostGuard('IconButton')

  return (
    <ComposeIconButton enabled={!disabled} onClick={onPress}>
      <Icon color={disabled ? 'btn.content.disabled' : 'content.primary'} name={name} />
    </ComposeIconButton>
  )
}
