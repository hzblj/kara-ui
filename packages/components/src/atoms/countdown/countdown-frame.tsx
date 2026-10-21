import type {CountdownUnits} from '@hzblj/kara-native'
import {MAX_FONT_SCALE, type TextVariant, useAppTheme} from '@hzblj/kara-theme'
import {type ReactNode, useEffect, useMemo, useState} from 'react'
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native'

const SECOND_MS = 1000
const HOUR = 3600
const DAY = 86_400
const DIVIDER = ' / '

/** Wakes a beat after the shape changes, so the frame never reads the boundary second twice. */
const SHAPE_CHANGE_SLACK_MS = 50

type CountdownShape = {
  days: number
  hasHours: boolean
}

const remainingSeconds = (endsAt: number) => Math.max(0, Math.round((endsAt - Date.now()) / SECOND_MS))

const countdownShape = (endsAt: number): CountdownShape => {
  const remaining = remainingSeconds(endsAt)

  return {days: Math.floor(remaining / DAY), hasHours: remaining >= HOUR}
}

/** When the next segment drops out — the last day, then the last hour — or `null` once only minutes are left. */
const nextShapeChange = (endsAt: number, {days, hasHours}: CountdownShape) => {
  if (days > 0) {
    return endsAt - (days * DAY - 0.5) * SECOND_MS
  }

  if (hasHours) {
    return endsAt - (HOUR - 0.5) * SECOND_MS
  }

  return null
}

/** The countdown's shape changes twice at most, so this re-renders twice at most — never once a second. */
const useCountdownShape = (endsAt: number) => {
  const [shape, setShape] = useState(() => countdownShape(endsAt))

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    const update = () => {
      const next = countdownShape(endsAt)

      setShape(current => (current.days === next.days && current.hasHours === next.hasHours ? current : next))

      const changesAt = nextShapeChange(endsAt, next)

      if (changesAt !== null) {
        timeout = setTimeout(update, Math.max(0, changesAt - Date.now()) + SHAPE_CHANGE_SLACK_MS)
      }
    }

    update()

    return () => clearTimeout(timeout)
  }, [endsAt])

  return shape
}

/** The widest string the countdown can show in its current shape, with zeros standing in for the digits. */
const countdownTemplate = ({days, hasHours}: CountdownShape, [day, hour, minute, second]: CountdownUnits) => {
  let template = ''

  if (days > 0) {
    template += `${'0'.repeat(String(days).length)}${day}${DIVIDER}`
  }

  if (hasHours) {
    template += `00${hour}${DIVIDER}`
  }

  return `${template}00${minute}${DIVIDER}00${second}`
}

const styles = StyleSheet.create({
  template: {opacity: 0},
})

type CountdownFrameProps = {
  children: ReactNode
  endsAt: number
  testID?: string
  units: CountdownUnits
  variant: TextVariant
}

/**
 * What gives the native countdown its size: an invisible React Native text of exactly the shape it draws, set the way
 * `RnText` sets the same variant, so the countdown takes the space any text of that variant would — and the native view
 * laid over it has to match it to the point. Accessibility reads the native view, never this.
 */
export const CountdownFrame = ({children, endsAt, testID, units, variant}: CountdownFrameProps) => {
  const theme = useAppTheme()
  const {fontScale} = useWindowDimensions()
  const shape = useCountdownShape(endsAt)
  const template = useMemo(() => countdownTemplate(shape, units), [shape, units])
  const style = theme.typography[variant]

  /** As in `RnText`: React Native grows the glyphs but not the line, so the line grows here by the same capped factor. */
  const lineHeight = style.lineHeight * Math.min(fontScale, MAX_FONT_SCALE)

  return (
    <View testID={testID}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.template}>
        <Text
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          numberOfLines={1}
          style={[style, {fontVariant: ['tabular-nums'], lineHeight}]}
        >
          {template}
        </Text>
      </View>
      {children}
    </View>
  )
}
