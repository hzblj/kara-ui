import {Checkbox as ComposeCheckbox, Row, Text} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {CheckboxComponent, CheckboxProps} from './checkbox.types'

export const Checkbox: CheckboxComponent = ({disabled = false, label, onValueChange, value}: CheckboxProps) => {
  useHostGuard('Checkbox')
  const theme = useAppTheme()
  const control = <ComposeCheckbox enabled={!disabled} onCheckedChange={onValueChange} value={value} />

  if (!label) {
    return control
  }

  return (
    <Row verticalAlignment="center">
      {control}
      <Text color={theme.colorString('content.primary')} style={theme.typography.body}>
        {label}
      </Text>
    </Row>
  )
}
