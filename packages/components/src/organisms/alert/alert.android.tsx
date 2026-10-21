import {AlertDialog, Button, Column, Text as ComposeText} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {AlertComponent, AlertProps} from './alert.types'

export const Alert: AlertComponent = ({
  confirmLabel = 'OK',
  message,
  onConfirm,
  onDismiss,
  title,
  visible,
}: AlertProps) => {
  useHostGuard('Alert')
  const theme = useAppTheme()

  if (!visible) {
    return null
  }

  return (
    <AlertDialog onDismissRequest={onDismiss}>
      <Column verticalArrangement={{spacedBy: 8}}>
        <ComposeText color={theme.colorString('content.primary')} style={theme.typography.headingXs}>
          {title}
        </ComposeText>
        {message ? (
          <ComposeText color={theme.colorString('content.secondary')} style={theme.typography.body}>
            {message}
          </ComposeText>
        ) : null}
        <Button onClick={onConfirm ?? onDismiss}>{confirmLabel}</Button>
      </Column>
    </AlertDialog>
  )
}
