import {Checkbox as ComposeCheckbox, Row, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {spacing, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../hooks/host-context'
import type {CheckboxComponent, CheckboxProps} from './checkbox.types'

/** Stands in for a missing handler: Material drops its 48dp touch target without one, and the box moves. */
const NOOP = () => undefined

/**
 * Material's checkbox, tinted with the accent. With a label it is a full-width row that toggles as a whole. It always
 * gets a handler, so a disabled or read-only box keeps the touch target an enabled one has, and lines up with it;
 * `enabled` is what stops the input.
 */
export const Checkbox: CheckboxComponent = ({disabled = false, label, onValueChange, testID, value}: CheckboxProps) => {
  useHostGuard('Checkbox')
  const theme = useAppTheme()
  const rowModifiers = useMemo(
    () => (disabled || !onValueChange ? [fillMaxWidth()] : [fillMaxWidth(), clickable(() => onValueChange(!value))]),
    [disabled, onValueChange, value]
  )
  // On the box, not the row: the box is its own toggleable node inside the row, and the one a test reads.
  const controlModifiers = useMemo(() => (testID ? [testIdModifier(testID)] : undefined), [testID])
  const control = (
    <ComposeCheckbox
      colors={{checkedColor: theme.color('fill.accent.primary'), checkmarkColor: theme.color('content.on.accent')}}
      enabled={!disabled}
      modifiers={controlModifiers}
      onCheckedChange={onValueChange ?? NOOP}
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
