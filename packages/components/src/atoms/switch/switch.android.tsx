import {Switch as ComposeSwitch, Row, Text} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {SwitchComponent, SwitchProps} from './switch.types'

export const Switch: SwitchComponent = ({disabled = false, label, onValueChange, value}: SwitchProps) => {
  useHostGuard('Switch')
  const theme = useAppTheme()
  const control = <ComposeSwitch enabled={!disabled} onCheckedChange={onValueChange} value={value} />

  if (!label) {
    return control
  }

  return (
    <Row horizontalArrangement="spaceBetween" verticalAlignment="center">
      <Text color={theme.colorString('content.primary')} style={theme.typography.body}>
        {label}
      </Text>
      {control}
    </Row>
  )
}
