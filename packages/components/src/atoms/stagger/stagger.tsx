import {isMotionComponent, type MotionPresetConfig, type SxEntryExit, type SxLayout} from '@hzblj/kara-sx'
import {duration} from '@hzblj/kara-theme'
import {Children, cloneElement, isValidElement, type Key, type ReactElement, useLayoutEffect, useRef} from 'react'

import {Box} from '../box'
import type {StaggerComponent, StaggerMotion, StaggerProps} from './stagger.types'

type MotionChildProps = {entering?: SxEntryExit; exiting?: SxEntryExit; layout?: SxLayout}

const asConfig = (motion: StaggerMotion): MotionPresetConfig => (typeof motion === 'string' ? {preset: motion} : motion)

/**
 * The stagger's preset, or the child's own with the delay added: a child that names its look keeps it and only takes
 * its turn. Reanimated's own builder is the child's, untouched, since adding a delay to one mutates it.
 */
const withDelay = (own: SxEntryExit | undefined, fallback: MotionPresetConfig, delay: number): SxEntryExit => {
  if (own === undefined) {
    return {...fallback, delay: (fallback.delay ?? 0) + delay}
  }

  if (typeof own === 'string') {
    return {delay, preset: own}
  }

  return typeof own === 'object' && own !== null && 'preset' in own ? {...own, delay: (own.delay ?? 0) + delay} : own
}

export const Stagger: StaggerComponent = ({
  children,
  entering = 'fadeUp',
  exiting,
  from = 'start',
  interval = 'stagger',
  layout,
  testID,
  ...sx
}: StaggerProps) => {
  // The children that have arrived already. Only the ones new in this render take turns, so a list that grows by a
  // page staggers the page, and an item added on its own arrives at once instead of after everything above it.
  const arrived = useRef(new Set<Key>())
  const items = Children.toArray(children)
  const turns = new Map<Key, number>()

  for (const item of items) {
    if (isValidElement(item) && item.key !== null && !arrived.current.has(item.key)) {
      turns.set(item.key, turns.size)
    }
  }

  // Marked once committed: a render React throws away must not use up a child's turn.
  useLayoutEffect(() => {
    for (const key of turns.keys()) {
      arrived.current.add(key)
    }
  })

  const step = duration[interval]
  const enter = asConfig(entering)
  const leave = exiting === undefined ? undefined : asConfig(exiting)

  const delayOf = (key: Key | null) => {
    const turn = key === null ? undefined : turns.get(key)

    if (turn === undefined) {
      return 0
    }

    return (from === 'start' ? turn : turns.size - 1 - turn) * step
  }

  return (
    // With `layout` the container moves and resizes with its children, so what holds it can follow.
    <Box layout={layout} testID={testID} {...sx}>
      {items.map(item => {
        if (!isValidElement<MotionChildProps>(item)) {
          return item
        }

        const delay = delayOf(item.key)

        // A component that takes the motion props gets them directly, with no view added around it.
        if (isMotionComponent(item.type)) {
          return cloneElement(item as ReactElement<MotionChildProps>, {
            entering: withDelay(item.props.entering, enter, delay),
            exiting: item.props.exiting ?? leave,
            layout: item.props.layout ?? layout,
          })
        }

        return (
          <Box entering={withDelay(undefined, enter, delay)} exiting={leave} key={item.key} layout={layout}>
            {item}
          </Box>
        )
      })}
    </Box>
  )
}
