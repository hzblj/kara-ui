import type {Metadata} from 'next'

import {COMPONENTS} from '../docs/components/registry'
import {componentHref, GUIDES} from '../docs/pages'
import {HERO_HEADLINE, HERO_LEDE, HERO_TAGLINE, SITE_NAME} from '../site'

/** A page as search and link previews see it — and what its social image says. */
export type SeoPage = {description: string; href: string; kicker?: string; title: string}

/** Where a page's social image is served: under `/og`, at the page's own path (`/og/index` for the home page). */
export const ogImageHref = (href: string) => `/og${href === '/' ? '/index' : href}`

export const HOME_PAGE: SeoPage = {description: HERO_TAGLINE, href: '/', title: HERO_HEADLINE}

/** Every page that has a social image: the home page, each guide, each component. */
export const SEO_PAGES: SeoPage[] = [
  HOME_PAGE,
  ...Object.values(GUIDES).map(page => ({
    description: page.description,
    href: page.href,
    kicker: 'Documentation',
    title: page.title,
  })),
  ...COMPONENTS.map(component => ({
    description: component.summary,
    href: componentHref(component.id),
    kicker: 'Component',
    title: component.name,
  })),
]

/**
 * A page's title, description and canonical URL, and the Open Graph and Twitter cards that go with them. Next replaces
 * `openGraph` and `twitter` whole rather than merging them with the layout's, so every page states them in full.
 */
export const pageMetadata = (
  page: SeoPage,
  {title = page.title, type = 'article'}: {title?: Metadata['title']; type?: 'article' | 'website'} = {}
): Metadata => {
  const shareTitle = page.href === '/' ? `${SITE_NAME} — ${page.title}` : `${page.title} · ${SITE_NAME}`
  const image = {alt: shareTitle, height: 630, url: ogImageHref(page.href), width: 1200}

  return {
    alternates: {canonical: page.href},
    description: page.description,
    openGraph: {
      description: page.description,
      images: [image],
      locale: 'en_US',
      siteName: SITE_NAME,
      title: shareTitle,
      type,
      url: page.href,
    },
    title,
    twitter: {card: 'summary_large_image', description: page.description, images: [image.url], title: shareTitle},
  }
}

/** The home page: the longer lede for search, the headline in the title. */
export const homeMetadata = pageMetadata(
  {...HOME_PAGE, description: HERO_LEDE},
  {title: {absolute: `${SITE_NAME} — ${HERO_HEADLINE}`}, type: 'website'}
)
