'use client'

import {useEffect, useState} from 'react'

import {cn} from '../ui/utils'
import {docsStyles} from './docs-styles'

const styles = docsStyles()
const ACTIVE_LINE = 140

type Heading = {id: string; label: string}

/**
 * Where a heading becomes the one being read: `ACTIVE_LINE` from the top, sliding down to the bottom edge over the
 * page's last screen. The sections too short to reach the line before the page runs out still get their turn, and at
 * the very end the last one on screen is active.
 */
const activeLine = () => {
  const {clientHeight, scrollHeight} = document.documentElement
  const remaining = scrollHeight - clientHeight - window.scrollY
  const approach = Math.min(1, Math.max(0, 1 - remaining / clientHeight))

  return ACTIVE_LINE + (clientHeight - ACTIVE_LINE) * approach
}

const activeIdFor = (headings: Heading[]) => {
  const line = activeLine()
  let active = headings[0]?.id

  for (const heading of headings) {
    const element = document.getElementById(heading.id)

    if (element && element.getBoundingClientRect().top <= line) {
      active = heading.id
    }
  }

  return active
}

const scrolledFraction = () => {
  const {clientHeight, scrollHeight} = document.documentElement
  const scrollable = scrollHeight - clientHeight

  return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1
}

export const DocsToc = ({headings}: {headings: Heading[]}) => {
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      setActiveId(activeIdFor(headings))
      setPercent(Math.round(scrolledFraction() * 100))
    }

    const schedule = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(measure)
      }
    }

    const controller = new AbortController()
    const {signal} = controller

    measure()
    window.addEventListener('scroll', schedule, {passive: true, signal})
    window.addEventListener('resize', schedule, {signal})

    return () => {
      controller.abort()
      cancelAnimationFrame(frame)
    }
  }, [headings])

  return (
    <aside className={styles.toc()}>
      <div className={styles.tocHeader()}>
        <p className={styles.tocLabel()}>On this page</p>
        <span className={styles.tocProgress()}>{percent}%</span>
      </div>
      <nav aria-label="On this page" className={styles.tocNav()}>
        <span aria-hidden="true" className={styles.tocRail()}>
          <span className={styles.tocRailFill()} style={{height: `${percent}%`}} />
        </span>
        {headings.map(heading => (
          <a
            aria-current={heading.id === activeId ? 'true' : undefined}
            className={cn(heading.id === activeId && styles.tocLinkActive())}
            href={`#${heading.id}`}
            key={heading.id}
          >
            {heading.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
