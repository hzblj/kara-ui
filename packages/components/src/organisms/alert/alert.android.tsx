import {AlertDialog, Text as ComposeText, TextButton} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../hooks/host-context'
import type {AlertComponent, AlertProps} from './alert.types'

/**
 * Material's `AlertDialog`, built from its slots — title, text, confirm and dismiss buttons. Content passed as plain
 * children has no slot to land in, and the dialog draws empty. The actions mirror the iOS alert: the confirm label
 * (in the destructive colour when asked) and the cancel label, whose slot stays empty when it is `null`.
 */
export const Alert: AlertComponent = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'OK',
  destructive = false,
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
    <AlertDialog
      colors={{
        containerColor: theme.color('surface.primary'),
        textContentColor: theme.color('content.secondary'),
        titleContentColor: theme.color('content.primary'),
      }}
      onDismissRequest={onDismiss}
    >
      <AlertDialog.Title>
        <ComposeText color={theme.colorString('content.primary')} style={theme.typography.headingXs}>
          {title}
        </ComposeText>
      </AlertDialog.Title>
      {message ? (
        <AlertDialog.Text>
          <ComposeText color={theme.colorString('content.secondary')} style={theme.typography.body}>
            {message}
          </ComposeText>
        </AlertDialog.Text>
      ) : null}
      <AlertDialog.ConfirmButton>
        <TextButton
          onClick={() => {
            // As on iOS, where any action closes the alert and reports it through `onDismiss`.
            onConfirm?.()
            onDismiss()
          }}
        >
          <ComposeText
            color={theme.colorString(destructive ? 'content.destructive' : 'content.accent')}
            style={theme.typography.body}
          >
            {confirmLabel}
          </ComposeText>
        </TextButton>
      </AlertDialog.ConfirmButton>
      {cancelLabel === null ? null : (
        <AlertDialog.DismissButton>
          <TextButton onClick={onDismiss}>
            <ComposeText color={theme.colorString('content.accent')} style={theme.typography.body}>
              {cancelLabel}
            </ComposeText>
          </TextButton>
        </AlertDialog.DismissButton>
      )}
    </AlertDialog>
  )
}
