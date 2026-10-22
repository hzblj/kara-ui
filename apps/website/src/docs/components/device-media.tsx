'use client'

import {type ReactNode, useEffect, useRef, useState} from 'react'
import {tv} from 'tailwind-variants'

import {useColorScheme, usePlatform} from '../../theme/use-root'
import {cn} from '../../ui/utils'
import type {MediaFrame, MediaPlatform, PlatformMedia} from '../source/media'

const styles = tv({
  slots: {
    fill: 'block size-full object-cover',
    phone:
      'block h-[92%] w-auto rounded-[22px] border border-border-secondary object-contain shadow-card-default max-[560px]:rounded-2xl',
    stage: 'relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden',
  },
  variants: {
    platform: {
      android: {stage: 'bg-stage-android'},
      ios: {stage: 'bg-stage-ios'},
    },
    screen: {
      true: {stage: 'bg-surface-tertiary'},
    },
  },
})

/**
 * How a recording starts: `view` plays while at least half of it is on screen, `hover` while the pointer is over the
 * element named by `hoverTarget` (a gallery card), `never` leaves it on its first frame.
 */
export type Autoplay = 'hover' | 'never' | 'view'

type DeviceMediaProps = {
  alt: string
  autoplay: Autoplay
  className?: string
  /** Plays only while the reader's platform choice is this one — for a gallery card that shows one of two. */
  followsPlatform?: boolean
  frame: MediaFrame
  /** A selector for the ancestor whose hover plays the clip; the element itself by default. */
  hoverTarget?: string
  media: PlatformMedia
  platform: MediaPlatform
}

const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** A touch screen has no hover: a gallery card plays while it is in view there instead. */
const playsInView = (autoplay: Autoplay) => autoplay === 'view' || matchMedia('(hover: none)').matches

/**
 * One platform's capture of a component: the still, or the recording when there is one, in the site's appearance —
 * both appearances are in the markup, so the toggle switches them without a flash, and only the one showing plays.
 */
export const DeviceMedia = ({
  alt,
  autoplay,
  className,
  followsPlatform = false,
  frame,
  hoverTarget,
  media,
  platform,
}: DeviceMediaProps) => {
  const scheme = useColorScheme()
  const activePlatform = usePlatform()
  const root = useRef<HTMLDivElement>(null)
  const videos = useRef<Record<'dark' | 'light', HTMLVideoElement | null>>({dark: null, light: null})
  const [isActive, setIsActive] = useState(false)
  const isScreen = frame === 'screen'
  const still = {dark: media.still.dark ?? media.still.light, light: media.still.light ?? media.still.dark}
  const video = {dark: media.video.dark ?? media.video.light, light: media.video.light ?? media.video.dark}
  const s = styles({platform, screen: isScreen})

  useEffect(() => {
    const element = root.current

    if (!element || autoplay === 'never' || (!video.light && !video.dark)) {
      return
    }

    if (playsInView(autoplay)) {
      const observer = new IntersectionObserver(([entry]) => setIsActive(Boolean(entry?.isIntersecting)), {
        threshold: 0.5,
      })
      observer.observe(element)
      return () => observer.disconnect()
    }

    const target = (hoverTarget ? element.closest<HTMLElement>(hoverTarget) : null) ?? element
    const enter = () => setIsActive(true)
    const leave = () => setIsActive(false)
    target.addEventListener('pointerenter', enter)
    target.addEventListener('pointerleave', leave)
    target.addEventListener('focusin', enter)
    target.addEventListener('focusout', leave)

    return () => {
      target.removeEventListener('pointerenter', enter)
      target.removeEventListener('pointerleave', leave)
      target.removeEventListener('focusin', enter)
      target.removeEventListener('focusout', leave)
    }
  }, [autoplay, hoverTarget, video.dark, video.light])

  useEffect(() => {
    const isShown = !followsPlatform || activePlatform === platform
    const shouldPlay = isActive && isShown && !(playsInView(autoplay) && prefersReducedMotion())

    for (const appearance of ['light', 'dark'] as const) {
      const element = videos.current[appearance]

      if (!element) {
        continue
      }

      if (shouldPlay && appearance === scheme) {
        element.play().catch(() => undefined)
      } else {
        element.pause()

        if (autoplay === 'hover') {
          element.currentTime = 0
        }
      }
    }
  }, [activePlatform, autoplay, followsPlatform, isActive, platform, scheme])

  const render = (appearance: 'dark' | 'light'): ReactNode => {
    const visibility = appearance === 'light' ? 'dark:hidden' : 'hidden dark:block'
    const media = cn(isScreen ? s.phone() : s.fill(), visibility)
    const source = video[appearance]

    if (source) {
      return (
        <video
          aria-label={appearance === 'light' ? alt : undefined}
          aria-hidden={appearance === 'dark' ? true : undefined}
          className={media}
          loop
          muted
          playsInline
          poster={still[appearance]}
          preload="none"
          ref={element => {
            videos.current[appearance] = element
          }}
        >
          <source src={source} type="video/mp4" />
        </video>
      )
    }

    return (
      <img
        alt={appearance === 'light' ? alt : ''}
        className={media}
        decoding="async"
        loading="lazy"
        src={still[appearance]}
      />
    )
  }

  return (
    <div className={cn(s.stage(), className)} ref={root}>
      {render('light')}
      {render('dark')}
    </div>
  )
}
