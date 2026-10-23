import {IconButton as ComposeIconButton} from '@expo/ui/jetpack-compose'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {IconButtonComponent, IconButtonProps} from './icon-button.types'

export const IconButton: IconButtonComponent = ({
  accessibilityHint,
  accessibilityLabel,
  disabled = false,
  name,
  onPress,
}: IconButtonProps) => {
  useHostGuard('IconButton')
  // The label rides on the icon, as Material's own icon buttons carry it; the hint labels the click.
  const modifiers = useAccessibilityModifiers({accessibilityHint}, accessibilityHint !== undefined)

  return (
    <ComposeIconButton enabled={!disabled} modifiers={modifiers} onClick={onPress}>
      <Icon
        accessibilityLabel={accessibilityLabel}
        color={disabled ? 'btn.content.disabled' : 'content.primary'}
        name={name}
      />
    </ComposeIconButton>
  )
}
