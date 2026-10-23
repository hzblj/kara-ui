'use client'

import {useEffect, useRef, useState} from 'react'
import {tv} from 'tailwind-variants'

import {MARK} from '../ui/wordmark'

/** The mark's four leaves, one sub-path each, in the order they open: clockwise from the top left. */
const LEAVES = MARK.split(/(?=M)/)
  .map(path => path.trim())
  .filter(Boolean)

const ORDER = [0, 2, 3, 1]

/** `idle` without JavaScript or with reduced motion: drawn, and never hidden. */
type State = 'closed' | 'idle' | 'open' | 'opening'

const styles = tv({
  slots: {
    // Each leaf turns and grows out of the mark's centre (50, 50 in its own units), and on hover leans away from it.
    leaf: '[transform-box:view-box] [transform-origin:50px_50px] group-data-[state=closed]:opacity-0 group-data-[state=closed]:[transform:scale(0.25)_rotate(-90deg)] group-data-[state=open]:transition-transform group-data-[state=open]:duration-250 group-data-[state=open]:ease-smooth-out group-data-[state=opening]:transition-[transform,opacity] group-data-[state=opening]:duration-500 group-data-[state=opening]:ease-bounce motion-reduce:transition-none',
    mark: 'group block overflow-visible',
  },
  variants: {
    leaf: {
      0: {leaf: 'group-hover:group-data-[state=open]:[transform:translate(-3px,-3px)]'},
      1: {leaf: 'group-hover:group-data-[state=open]:[transform:translate(-3px,3px)]'},
      2: {leaf: 'group-hover:group-data-[state=open]:[transform:translate(3px,-3px)]'},
      3: {leaf: 'group-hover:group-data-[state=open]:[transform:translate(3px,3px)]'},
    },
  },
})

/** How long the last leaf takes to settle: its delay plus `verySlow`, so the hover only takes over once it has. */
const STAGGER_MS = 70
const BLOOM_MS = 500 + STAGGER_MS * (LEAVES.length - 1)

/**
 * kara's mark between the components and the footer, blooming when it scrolls into view: the four leaves open out of
 * the middle one after another, the way the mark is drawn, then lean apart under the pointer. Scrolled away, it closes,
 * and blooms again when it comes back.
 */
export const MarkBloom = ({className}: {className?: string}) => {
  const ref = useRef<SVGSVGElement>(null)
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    const element = ref.current

    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let frame = 0
    let timer = 0
    setState('closed')

    const reset = () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }

    // Blooms once most of it is in view, and closes again once it is all out, to bloom the next time it comes back.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return
        }

        if (entry.intersectionRatio >= 0.6) {
          reset()
          // Two frames, so the closed state has been drawn before the transition starts from it.
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => setState('opening'))
          })
          timer = window.setTimeout(() => setState('open'), BLOOM_MS + 50)
        } else if (!entry.isIntersecting) {
          reset()
          setState('closed')
        }
      },
      {threshold: [0, 0.6]}
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      reset()
    }
  }, [])

  return (
    <svg
      aria-hidden="true"
      className={styles().mark({className})}
      data-state={state}
      fill="currentColor"
      ref={ref}
      viewBox="-4 -4 108 108"
    >
      {LEAVES.map((leaf, index) => (
        <path
          className={styles({leaf: index as 0 | 1 | 2 | 3}).leaf()}
          d={leaf}
          key={leaf}
          style={state === 'opening' ? {transitionDelay: `${ORDER.indexOf(index) * STAGGER_MS}ms`} : undefined}
        />
      ))}
    </svg>
  )
}
