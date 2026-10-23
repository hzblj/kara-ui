import {Switch as ComposeSwitch, Row, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {haptics} from '../../haptics'
import {useHostGuard} from '../../host-context'
import type {SwitchComponent, SwitchProps} from './switch.types'

/** Stands in for a missing handler: Material drops its 48dp touch target without one, and the switch moves. */
const NOOP = () => undefined

/**
 * Material's switch, tinted with the accent like SwiftUI's toggle. With a label it is a full-width row — label at the
 * start, switch at the end — and the whole row toggles, the way a Material settings row does. A flip plays
 * `toggleOn`/`toggleOff` — Android 14's constants made for switches — since Compose's Material switch plays nothing
 * of its own. iOS stays silent, as `UISwitch` does.
 */
export const Switch: SwitchComponent = ({disabled = false, label, onValueChange, value}: SwitchProps) => {
  useHostGuard('Switch')
  const theme = useAppTheme()
  const toggle = useCallback(
    (next: boolean) => {
      haptics.play(next ? 'toggleOn' : 'toggleOff')
      onValueChange?.(next)
    },
    [onValueChange]
  )
  const rowModifiers = useMemo(
    () => (disabled || !onValueChange ? [fillMaxWidth()] : [fillMaxWidth(), clickable(() => toggle(!value))]),
    [disabled, onValueChange, toggle, value]
  )
  const control = (
    <ComposeSwitch
      colors={{
        checkedBorderColor: theme.color('fill.accent.primary'),
        checkedThumbColor: theme.color('content.on.accent'),
        checkedTrackColor: theme.color('fill.accent.primary'),
      }}
      enabled={!disabled}
      onCheckedChange={onValueChange ? toggle : NOOP}
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
