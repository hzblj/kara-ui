import {Toggle} from '@expo/ui/swift-ui'
import {disabled as disabledModifier, tint} from '@expo/ui/swift-ui/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {CheckboxComponent, CheckboxProps} from './checkbox.types'

export const Checkbox: CheckboxComponent = ({disabled = false, label, onValueChange, testID, value}: CheckboxProps) => {
  useHostGuard('Checkbox')
  const theme = useAppTheme()

  const modifiers = useMemo(() => {
    const list = [tint(theme.color('fill.accent.primary'))]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [disabled, theme])

  return <Toggle isOn={value} label={label} modifiers={modifiers} onIsOnChange={onValueChange} testID={testID} />
}
