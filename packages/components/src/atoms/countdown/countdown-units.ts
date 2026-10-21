import type {CountdownUnits} from '@hzblj/kara-native'
import {useMemo} from 'react'

const FALLBACK_UNITS: CountdownUnits = ['d', 'h', 'm', 's']

type Unit = 'day' | 'hour' | 'minute' | 'second'

/** The first letter of the locale's short unit name — `d`, `h`, `m`, `s` in English, `d`, `h`, `m`, `s` in Czech too. */
const unitInitial = (locale: string | undefined, unit: Unit, fallback: string) => {
  try {
    const parts = new Intl.NumberFormat(locale, {style: 'unit', unit, unitDisplay: 'short'}).formatToParts(1)
    const initial = parts
      .find(part => part.type === 'unit')
      ?.value.trim()
      .charAt(0)

    return initial || fallback
  } catch {
    return fallback
  }
}

/** The caller's units, else the locale's initials, else English ones. */
export const useCountdownUnits = (locale: string | undefined, units: CountdownUnits | undefined): CountdownUnits =>
  useMemo(
    () =>
      units ?? [
        unitInitial(locale, 'day', FALLBACK_UNITS[0]),
        unitInitial(locale, 'hour', FALLBACK_UNITS[1]),
        unitInitial(locale, 'minute', FALLBACK_UNITS[2]),
        unitInitial(locale, 'second', FALLBACK_UNITS[3]),
      ],
    [locale, units]
  )

/** `endsAt` as the epoch milliseconds the native views take. */
export const toEpochMs = (endsAt: Date | number) => (typeof endsAt === 'number' ? endsAt : endsAt.getTime())
