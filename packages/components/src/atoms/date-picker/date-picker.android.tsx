import {DateTimePicker} from '@expo/ui/community/datetime-picker'
import {DateTimePicker as ComposeDateTimePicker, Host, RNHostView} from '@expo/ui/jetpack-compose'
import {alpha, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {opacity, useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo, useState} from 'react'

import {useInsideHost} from '../../host-context'
import {Box} from '../box'
import {Pressable} from '../pressable'
import {RnText} from '../rn-text'
import type {DatePickerComponent, DatePickerMode, DatePickerProps} from './date-picker.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

const formatted = (value: Date, mode: DatePickerMode): string => {
  if (mode === 'time') {
    return value.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})
  }

  const date = value.toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})

  return mode === 'datetime'
    ? `${date} ${value.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}`
    : date
}

/** Material's calendar counts in UTC days: `value`'s local day goes in as that day's UTC midnight. */
const utcDayOf = (value: Date): string =>
  new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())).toISOString()

/** The UTC day the calendar reports, back on `value`'s local time of day. */
const localDayOf = (utcDay: Date, value: Date): Date => {
  const next = new Date(value)
  next.setFullYear(utcDay.getUTCFullYear(), utcDay.getUTCMonth(), utcDay.getUTCDate())

  return next
}

/**
 * Material's calendar in place, for `graphical`: the month and its days, without the title and headline its dialog
 * shows, in the accent. It also reports its day when it first shows and whenever `value` hands it a new one, so only a
 * day that differs from `value` goes out. It has no disabled state, so a disabled one is dimmed and offers only the
 * selected day.
 */
const Calendar = ({disabled, max, min, onValueChange, testID, value}: DatePickerProps) => {
  const theme = useAppTheme()

  const onDateSelected = useCallback(
    (date: Date) => {
      const next = localDayOf(date, value)

      if (!disabled && next.getTime() !== value.getTime()) {
        onValueChange?.(next)
      }
    },
    [disabled, onValueChange, value]
  )

  const modifiers = useMemo(
    () => [...(disabled ? [alpha(opacity.o40)] : []), ...(testID ? [testIdModifier(testID)] : [])],
    [disabled, testID]
  )

  return (
    <ComposeDateTimePicker
      color={theme.color('fill.accent.primary')}
      displayedComponents="date"
      initialDate={utcDayOf(value)}
      modifiers={modifiers}
      onDateSelected={onDateSelected}
      selectableDates={disabled ? {end: value, start: value} : min || max ? {end: max, start: min} : undefined}
      showHeadline={false}
      showTitle={false}
      showVariantToggle={false}
      variant="picker"
    />
  )
}

/**
 * The value as a field that opens Material's date picker dialog on a tap. Android's picker *is* a dialog (mounted, it
 * opens), so it is mounted only while open, and unmounted on confirm or dismiss, as the component asks its caller to.
 * Both are React Native views; inside a `Screen` or `Island` `RNHostView` carries them into that host, sized to the
 * field (see `useInsideHost`). With `datePickerStyle="graphical"` and a date to pick, it is Material's calendar in
 * place instead: a Compose view, in a host of its own the width of its container, or straight in the enclosing one.
 */
export const DatePicker: DatePickerComponent = (props: DatePickerProps) => {
  const {datePickerStyle = 'compact', disabled = false, max, min, mode = 'date', onValueChange, testID, value} = props
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

  if (datePickerStyle === 'graphical' && mode !== 'time') {
    const calendar = <Calendar {...props} disabled={disabled} />

    return insideHost ? (
      calendar
    ) : (
      <Host
        colorScheme={theme.dark ? 'dark' : 'light'}
        matchContents={MATCH_HEIGHT_ONLY}
        seedColor={theme.materialSeed}
      >
        {calendar}
      </Host>
    )
  }

  const field = (
    <>
      <Pressable
        alignSelf="flex-start"
        bg="fill.tertiary"
        borderRadius="medium"
        disabled={disabled}
        onPress={show}
        px="s12"
        py="s8"
        testID={testID}
      >
        <RnText color={disabled ? 'content.tertiary' : 'content.primary'} variant="body">
          {formatted(value, mode)}
        </RnText>
      </Pressable>
      {open && !disabled ? (
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
