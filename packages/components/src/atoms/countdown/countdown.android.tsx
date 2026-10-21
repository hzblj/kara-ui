import {Host} from '@expo/ui/jetpack-compose'
import {Countdown as NativeCountdown} from '@hzblj/kara-native/jetpack-compose'
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

  /**
   * Compose reads `sp` and scales it by the font scale itself — uncapped — while the React Native frame under it stops
   * at `MAX_FONT_SCALE`. Pre-dividing by the part Compose would add past the cap lands both on the same size.
   */
  const scale = Math.min(fontScale, MAX_FONT_SCALE) / fontScale

  return (
    <CountdownFrame endsAt={endsAtMs} testID={testID} units={resolvedUnits} variant={variant}>
      <Host
        colorScheme={theme.dark ? 'dark' : 'light'}
        pointerEvents="none"
        seedColor={theme.materialSeed}
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
