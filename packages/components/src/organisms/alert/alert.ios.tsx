import {Button, Alert as SwiftUIAlert, Text as SwiftUIText} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {AlertComponent, AlertProps} from './alert.types'

export const Alert: AlertComponent = ({
  confirmLabel = 'OK',
  destructive = false,
  message,
  onConfirm,
  onDismiss,
  title,
  visible,
}: AlertProps) => {
  useHostGuard('Alert')

  return (
    <SwiftUIAlert
      isPresented={visible}
      onIsPresentedChange={next => {
        if (!next) {
          onDismiss()
        }
      }}
      title={title}
    >
      <SwiftUIAlert.Actions>
        <Button label={confirmLabel} onPress={onConfirm ?? onDismiss} role={destructive ? 'destructive' : 'default'} />
        <Button label="Cancel" onPress={onDismiss} role="cancel" />
      </SwiftUIAlert.Actions>
      {/*
        `Alert.Message` is a native slot view, and a SwiftUI host cannot render a bare string — it
        becomes a `RawText` node with no component view and trips an assertion in
        `RCTComponentViewFactory`. The alert mounts even while dismissed (`visible` only drives
        `isPresented`), so an unwrapped string here crashes on mount, not on open. Plain SwiftUI
        `Text` rather than the themed atom, so the message keeps system alert styling.
      */}
      {message ? (
        <SwiftUIAlert.Message>
          <SwiftUIText>{message}</SwiftUIText>
        </SwiftUIAlert.Message>
      ) : null}
    </SwiftUIAlert>
  )
}
