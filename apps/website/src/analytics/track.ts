import {track as trackOnVercel} from '@vercel/analytics'

import type {Platform} from '../theme/theme'

declare global {
  interface Window {
    /** Google's tag, defined only on a production deployment (`GoogleAnalytics`). */
    gtag?: (command: 'event', name: string, params: Record<string, string>) => void
  }
}

/** Every event the site sends, with its parameters — GA4's snake_case names, so the reports read as they are. */
export type AnalyticsEvents = {
  /** A press on one of the hero's calls to action, named by its `data-cta`. */
  click_cta: {cta: string}
  /** A link out to the repository or the package. */
  click_outbound: {destination: 'github' | 'npm'}
  /** A copy button: the install command, a code block, or a component's snippet. */
  copy_code: {source: 'code_block' | 'component_snippet' | 'install'}
  /** The gallery's platform switch. */
  select_platform: {platform: Platform}
  /** A component page's Preview and Code tabs. */
  select_preview_tab: {tab: 'code' | 'preview'}
  /** The light/dark toggle, with the appearance it switched to. */
  toggle_theme: {theme: 'dark' | 'light'}
}

/**
 * Sends one event to Google Analytics and to Vercel's. Google's tag exists only in production, so elsewhere the event
 * goes nowhere; Vercel records custom events on its paid plans and drops them otherwise.
 */
export const track = <TEvent extends keyof AnalyticsEvents>(event: TEvent, params: AnalyticsEvents[TEvent]) => {
  window.gtag?.('event', event, params)
  trackOnVercel(event, params)
}
