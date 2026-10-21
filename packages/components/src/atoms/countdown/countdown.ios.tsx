import {Host} from '@expo/ui/swift-ui'
import {Countdown as NativeCountdown} from '@hzblj/kara-native/swift-ui'
import {MAX_FONT_SCALE, useAppTheme} from '@hzblj/kara-theme'
import {StyleSheet, useWindowDimensions} from 'react-native'
import type {CountdownComponent, CountdownProps} from './countdown.types'
import {CountdownFrame} from './countdown-frame'
import {toEpochMs, useCountdownUnits} from './countdown-units'

export const Countdown: CountdownComponent = ({
  color = 'content.primary',
  endsAt,
  locale,
  testID,
  units,
  variant = 'body',
}: CountdownProps) => {
  const theme = useAppTheme()
  const {fontScale} = useWindowDimensions()
  const resolvedUnits = useCountdownUnits(locale, units)
  const endsAtMs = toEpochMs(endsAt)
  const style = theme.typography[variant]

  /** SwiftUI is handed points, so it is scaled here exactly as React Native scales the frame text under it. */
  const scale = Math.min(fontScale, MAX_FONT_SCALE)

  return (
    <CountdownFrame endsAt={endsAtMs} testID={testID} units={resolvedUnits} variant={variant}>
      <Host
        colorScheme={theme.dark ? 'dark' : 'light'}
        ignoreSafeArea="all"
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <NativeCountdown
          color={theme.color(color)}
          endsAt={endsAtMs}
          fontFamily={style.fontFamily}
          fontSize={style.fontSize * scale}
          fontWeight={style.weight}
          lineHeight={style.lineHeight * scale}
          units={resolvedUnits}
        />
      </Host>
    </CountdownFrame>
  )
}
