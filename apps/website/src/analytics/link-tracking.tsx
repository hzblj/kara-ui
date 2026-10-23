'use client'

import {useEffect} from 'react'

import {NPM_URL, REPOSITORY_URL} from '../site'
import {type AnalyticsEvents, track} from './track'

const OUTBOUND: [string, AnalyticsEvents['click_outbound']['destination']][] = [
  [REPOSITORY_URL, 'github'],
  [NPM_URL, 'npm'],
]

/**
 * One listener for the whole document, so the links stay in server components: a link out to the repository or the
 * package is `click_outbound`, and one carrying `data-cta` is `click_cta`. Capturing, so it hears the click before a
 * client-side navigation takes the page away.
 */
export const LinkTracking = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null

      if (!link) {
        return
      }

      if (link.dataset.cta) {
        track('click_cta', {cta: link.dataset.cta})
      }

      const destination = OUTBOUND.find(([url]) => link.href.startsWith(url))?.[1]

      if (destination) {
        track('click_outbound', {destination})
      }
    }

    document.addEventListener('click', onClick, {capture: true})

    return () => document.removeEventListener('click', onClick, {capture: true})
  }, [])

  return null
}
