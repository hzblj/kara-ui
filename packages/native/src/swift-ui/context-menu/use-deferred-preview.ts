import {useCallback, useEffect, useRef, useState} from 'react'
import type {GestureResponderEvent} from 'react-native'

/** How long a finger rests on the trigger before the preview mounts. UIKit asks for it only once the press completes. */
const PREVIEW_MOUNT_DELAY = 100

/** How far the finger may drift, in points, and still count as resting. */
const TOUCH_SLOP = 10

/**
 * Mounts the preview only once a finger has rested on the trigger — and then keeps it mounted. UIKit asks for the
 * preview when the long press completes, so it is there in time, while triggers that are only scrolled past never
 * mount theirs: a list of cards that mounted every preview up front paid for all of them.
 */
export const useDeferredPreview = () => {
  const [isPreviewMounted, setIsPreviewMounted] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const start = useRef({pageX: 0, pageY: 0})

  const cancel = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = undefined
  }, [])

  useEffect(() => cancel, [cancel])

  const onTouchStart = useCallback(
    (event: GestureResponderEvent) => {
      cancel()
      start.current = {pageX: event.nativeEvent.pageX, pageY: event.nativeEvent.pageY}

      if (isPreviewMounted) {
        return
      }

      timer.current = setTimeout(() => setIsPreviewMounted(true), PREVIEW_MOUNT_DELAY)
    },
    [cancel, isPreviewMounted]
  )

  const onTouchMove = useCallback(
    (event: GestureResponderEvent) => {
      const dx = Math.abs(event.nativeEvent.pageX - start.current.pageX)
      const dy = Math.abs(event.nativeEvent.pageY - start.current.pageY)

      if (dx > TOUCH_SLOP || dy > TOUCH_SLOP) {
        cancel()
      }
    },
    [cancel]
  )

  return {isPreviewMounted, onTouchEnd: cancel, onTouchMove, onTouchStart}
}
