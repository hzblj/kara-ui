import {useEffect, useState} from 'react'

/** Holds each step for its duration and wraps around, while `playing`. Step 0 otherwise. */
export const useStep = (playing: boolean, steps: readonly number[] | undefined): number => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const hold = steps?.[step]

    if (!playing || !steps || hold === undefined) {
      return
    }

    const timer = setTimeout(() => setStep((step + 1) % steps.length), hold)

    return () => clearTimeout(timer)
  }, [playing, step, steps])

  return step
}

const FRAME = 1000 / 30

/** 0…1 across `period` milliseconds and round again, at thirty frames a second, while `playing`. 0 otherwise. */
export const usePhase = (playing: boolean, period: number | undefined): number => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!playing || !period) {
      return
    }

    const start = Date.now()
    const timer = setInterval(() => setPhase(((Date.now() - start) % period) / period), FRAME)

    return () => clearInterval(timer)
  }, [period, playing])

  return phase
}

const OPENING_DELAY = 400

/**
 * `open`, but only once the scene has been on screen for a moment. A SwiftUI alert or dialog asked to present while its
 * host is still mounting never appears, so an overlay a still should catch open waits for its host first.
 */
export const useOpened = (open: boolean): boolean => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), OPENING_DELAY)
    return () => clearTimeout(timer)
  }, [])

  return mounted && open
}
