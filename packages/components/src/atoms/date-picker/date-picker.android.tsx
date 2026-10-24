import {DateTimePicker} from '@expo/ui/community/datetime-picker'
import {RNHostView} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useState} from 'react'

import {useInsideHost} from '../../host-context'
import {Box} from '../box'
import {Pressable} from '../pressable'
import {RnText} from '../rn-text'
import type {DatePickerComponent, DatePickerMode, DatePickerProps} from './date-picker.types'

const formatted = (value: Date, mode: DatePickerMode): string => {
  if (mode === 'time') {
    return value.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})
  }

  const date = value.toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})

  return mode === 'datetime'
    ? `${date} ${value.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}`
    : date
}

/**
 * The value as a field that opens Material's date picker dialog on a tap. Android's picker *is* a dialog — mounted, it
 * opens — so it is mounted only while open, and unmounted on confirm or dismiss, as the component asks its caller to.
 * Both are React Native views; inside a `Screen` or `Island` `RNHostView` carries them into that host, sized to the
 * field (see `useInsideHost`).
 */
export const DatePicker: DatePickerComponent = ({
  max,
  min,
  mode = 'date',
  onValueChange,
  testID,
  value,
}: DatePickerProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const [open, setOpen] = useState(false)

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  const onChange = useCallback(
    (_event: unknown, date: Date) => {
      setOpen(false)
      onValueChange?.(date)
    },
    [onValueChange]
  )

  const field = (
    <>
      <Pressable
        alignSelf="flex-start"
        bg="fill.tertiary"
        borderRadius="medium"
        onPress={show}
        px="s12"
        py="s8"
        testID={testID}
      >
        <RnText variant="body">{formatted(value, mode)}</RnText>
      </Pressable>
      {open ? (
        <DateTimePicker
          accentColor={theme.colorString('fill.accent.primary')}
          maximumDate={max}
          minimumDate={min}
          mode={mode}
          onDismiss={hide}
          onValueChange={onChange}
          presentation="dialog"
          value={value}
        />
      ) : null}
    </>
  )

  return insideHost ? (
    <RNHostView matchContents>
      <Box>{field}</Box>
    </RNHostView>
  ) : (
    field
  )
}
