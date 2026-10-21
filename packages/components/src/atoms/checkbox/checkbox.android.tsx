import {Checkbox as ComposeCheckbox, Row, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth} from '@expo/ui/jetpack-compose/modifiers'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {CheckboxComponent, CheckboxProps} from './checkbox.types'

/**
 * Material's checkbox, tinted with the accent. With a label it is a full-width row that toggles as a whole; the gap is
 * explicit because a checkbox without a handler drops Material's 48dp touch target, and with it the space around it.
 */
export const Checkbox: CheckboxComponent = ({disabled = false, label, onValueChange, value}: CheckboxProps) => {
  useHostGuard('Checkbox')
  const theme = useAppTheme()
  const rowModifiers = useMemo(
    () => (disabled || !onValueChange ? [fillMaxWidth()] : [fillMaxWidth(), clickable(() => onValueChange(!value))]),
    [disabled, onValueChange, value]
  )
  const control = (
    <ComposeCheckbox
      colors={{checkedColor: theme.color('fill.accent.primary'), checkmarkColor: theme.color('content.on.bg')}}
      enabled={!disabled}
      onCheckedChange={onValueChange}
      value={value}
    />
  )

  if (!label) {
    return control
  }

  return (
    <Row horizontalArrangement={{spacedBy: spacing.s8}} modifiers={rowModifiers} verticalAlignment="center">
      {control}
      <Text color={theme.colorString(disabled ? 'content.tertiary' : 'content.primary')} style={theme.typography.body}>
        {label}
      </Text>
    </Row>
  )
}
