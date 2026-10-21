import {Button} from '@expo/ui/swift-ui'
import {buttonStyle, disabled as disabledModifier} from '@expo/ui/swift-ui/modifiers'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {IconButtonComponent, IconButtonProps} from './icon-button.types'

export const IconButton: IconButtonComponent = ({disabled = false, name, onPress, testID}: IconButtonProps) => {
  useHostGuard('IconButton')

  const modifiers = useMemo(() => {
    const list = [buttonStyle('plain')]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [disabled])

  return (
    <Button modifiers={modifiers} onPress={onPress} testID={testID}>
      <Icon color={disabled ? 'btn.content.disabled' : 'content.primary'} name={name} />
    </Button>
  )
}
