'use client'

import {type ReactNode, useEffect, useRef} from 'react'

const EASE_MS = 700

/**
 * A marquee's moving track that eases to a stop under the pointer and back up to speed when it leaves, instead of the
 * jolt of `animation-play-state: paused`. Without its CSS animation (reduced motion) there is nothing to ease.
 */
export const MarqueeTrack = ({children, className}: {children: ReactNode; className?: string}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    const animation = element?.getAnimations()[0]

    if (!element || !animation) {
      return
    }

    let frame = 0

    const easeTo = (target: number) => {
      cancelAnimationFrame(frame)
      const from = animation.playbackRate
      const start = performance.now()

      const step = (now: number) => {
        const t = Math.min((now - start) / EASE_MS, 1)
        // Setting the rate keeps the current time, so the track slows where it is rather than jumping.
        animation.playbackRate = from + (target - from) * (1 - (1 - t) ** 3)

        if (t < 1) {
          frame = requestAnimationFrame(step)
        }
      }

      frame = requestAnimationFrame(step)
    }

    const slow = () => easeTo(0)
    const resume = () => easeTo(1)
    element.addEventListener('pointerenter', slow)
    element.addEventListener('pointerleave', resume)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointerenter', slow)
      element.removeEventListener('pointerleave', resume)
    }
  }, [])

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  )
}
