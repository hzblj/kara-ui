import {Switch as ComposeSwitch, Row, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {SwitchComponent, SwitchProps} from './switch.types'

/**
 * Material's switch, tinted with the accent like SwiftUI's toggle. With a label it is a full-width row — label at the
 * start, switch at the end — and the whole row toggles, the way a Material settings row does.
 */
export const Switch: SwitchComponent = ({disabled = false, label, onValueChange, value}: SwitchProps) => {
  useHostGuard('Switch')
  const theme = useAppTheme()
  const rowModifiers = useMemo(
    () => (disabled || !onValueChange ? [fillMaxWidth()] : [fillMaxWidth(), clickable(() => onValueChange(!value))]),
    [disabled, onValueChange, value]
  )
  const control = (
    <ComposeSwitch
      colors={{
        checkedBorderColor: theme.color('fill.accent.primary'),
        checkedThumbColor: theme.color('content.on.bg'),
        checkedTrackColor: theme.color('fill.accent.primary'),
      }}
      enabled={!disabled}
      onCheckedChange={onValueChange}
      value={value}
    />
  )

  if (!label) {
    return control
  }

  return (
    <Row horizontalArrangement="spaceBetween" modifiers={rowModifiers} verticalAlignment="center">
      <Text color={theme.colorString(disabled ? 'content.tertiary' : 'content.primary')} style={theme.typography.body}>
        {label}
      </Text>
      {control}
    </Row>
  )
}
