'use client'

import {type ReactNode, useEffect, useRef} from 'react'

/** Drift speed, in points per millisecond: slow enough to read a card as it passes. */
const SPEED = 0.04
/** How long the drift takes to come back up to speed after a hover or a drag, and to slow down under the pointer. */
const EASE_MS = 700
/** After a finger, a wheel or a mouse lets go: the pause before the drift comes back. */
const RESUME_AFTER_MS = 900
/** How far a press may move and still be a click on the card under it. */
const CLICK_SLOP = 6
/** How quickly a flung row slows down, per millisecond. */
const FRICTION = 0.0035

/**
 * A row of the strip: a horizontal scroller that drifts by itself and is the reader's to move. A finger or a trackpad
 * scrolls it natively, a mouse drags it and lets it glide; either way the drift waits, then eases back up. Its children
 * are two copies of the row, so moving it by one copy's width shows the same thing: it wraps near its ends without a
 * seam. With reduced motion it does not drift, and still scrolls.
 */
export const MarqueeTrack = ({
  children,
  className,
  reverse = false,
  trackClassName,
}: {
  children: ReactNode
  className?: string
  reverse?: boolean
  trackClassName?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const drifts = !matchMedia('(prefers-reduced-motion: reduce)').matches
    const direction = reverse ? -1 : 1
    let copy = element.scrollWidth / 2
    let position = copy
    let rate = 1
    let rateFrom = 1
    let rateTo = 1
    let rateStart = 0
    let interacting = false
    let resumeTimer = 0
    let last = performance.now()
    let frame = 0
    let glide = 0

    // Keeps the scroll position a copy's width away from either end, where the same cards are.
    const wrap = () => {
      const margin = Math.min(copy / 2, 400)
      const max = element.scrollWidth - element.clientWidth

      if (position < margin) {
        position += copy
      } else if (position > max - margin) {
        position -= copy
      }
    }

    const easeRate = (target: number) => {
      rateFrom = rate
      rateTo = target
      rateStart = performance.now()
    }

    const hold = () => {
      interacting = true
      window.clearTimeout(resumeTimer)
      easeRate(0)
    }

    const release = (after = RESUME_AFTER_MS) => {
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(() => {
        interacting = false
        position = element.scrollLeft
        easeRate(1)
      }, after)
    }

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 64)
      last = now
      const t = Math.min((now - rateStart) / EASE_MS, 1)
      rate = rateFrom + (rateTo - rateFrom) * (1 - (1 - t) ** 3)

      if (glide !== 0) {
        position -= glide * elapsed
        glide *= Math.exp(-FRICTION * elapsed)

        if (Math.abs(glide) < 0.01) {
          glide = 0
          release()
        }

        wrap()
        element.scrollLeft = position
      } else if (!interacting && drifts && rate > 0) {
        position += direction * SPEED * rate * elapsed
        wrap()
        element.scrollLeft = position
      }

      frame = requestAnimationFrame(tick)
    }

    // A touch or a trackpad moves it natively: follow where it went, and wrap once it settles.
    const onScroll = () => {
      if (interacting) {
        position = element.scrollLeft
      }
    }

    const onTouchStart = () => hold()
    const onTouchEnd = () => release()
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        hold()
        release()
      }
    }

    // A mouse drags it, and lets it glide on at the speed it left with.
    let dragFrom: {pointer: number; scroll: number} | undefined
    let dragged = false
    let velocity = 0
    let lastMove = {time: 0, x: 0}

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) {
        return
      }

      hold()
      glide = 0
      dragFrom = {pointer: event.clientX, scroll: element.scrollLeft}
      dragged = false
      velocity = 0
      lastMove = {time: event.timeStamp, x: event.clientX}
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragFrom) {
        return
      }

      const distance = event.clientX - dragFrom.pointer

      if (!dragged && Math.abs(distance) > CLICK_SLOP) {
        dragged = true
        element.setPointerCapture(event.pointerId)
        element.dataset.dragging = ''
      }

      if (dragged) {
        const elapsed = Math.max(event.timeStamp - lastMove.time, 1)
        velocity = 0.8 * ((event.clientX - lastMove.x) / elapsed) + 0.2 * velocity
        lastMove = {time: event.timeStamp, x: event.clientX}
        position = dragFrom.scroll - distance
        wrap()
        element.scrollLeft = position
        dragFrom = {pointer: event.clientX, scroll: position}
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!dragFrom) {
        return
      }

      dragFrom = undefined
      delete element.dataset.dragging

      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId)
      }

      // Still moving when it let go: glide. Otherwise the drift comes back once the pointer leaves.
      if (dragged && Math.abs(velocity) > 0.1) {
        glide = velocity
      } else if (!element.matches(':hover')) {
        release()
      }
    }

    // A drag ends on a card: that is not a click on it.
    const onClick = (event: MouseEvent) => {
      if (dragged) {
        event.preventDefault()
        event.stopPropagation()
        dragged = false
      }
    }

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        hold()
      }
    }

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !dragFrom && glide === 0) {
        release(0)
      }
    }

    const onResize = () => {
      const offset = position - copy
      copy = element.scrollWidth / 2
      position = copy + offset
      wrap()
      element.scrollLeft = position
    }

    // Every listener on one signal: aborting it is the whole teardown.
    const controller = new AbortController()
    const {signal} = controller
    const passive = {passive: true, signal}

    element.scrollLeft = position
    frame = requestAnimationFrame(tick)
    element.addEventListener('scroll', onScroll, passive)
    element.addEventListener('touchstart', onTouchStart, passive)
    element.addEventListener('touchend', onTouchEnd, passive)
    element.addEventListener('wheel', onWheel, passive)
    element.addEventListener('pointerdown', onPointerDown, {signal})
    element.addEventListener('pointermove', onPointerMove, {signal})
    element.addEventListener('pointerup', onPointerUp, {signal})
    element.addEventListener('pointercancel', onPointerUp, {signal})
    element.addEventListener('pointerenter', onPointerEnter, {signal})
    element.addEventListener('pointerleave', onPointerLeave, {signal})
    element.addEventListener('click', onClick, {capture: true, signal})
    window.addEventListener('resize', onResize, {signal})

    return () => {
      controller.abort()
      cancelAnimationFrame(frame)
      window.clearTimeout(resumeTimer)
    }
  }, [reverse])

  return (
    <div className={className} ref={ref}>
      <div className={trackClassName}>{children}</div>
    </div>
  )
}
