import type {MetadataRoute} from 'next'

import {READING_ORDER} from '../src/docs/pages'
import {SITE_URL} from '../src/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {changeFrequency: 'monthly', priority: 1, url: SITE_URL},
    ...READING_ORDER.map(page => ({
      changeFrequency: 'monthly' as const,
      priority: page.href.startsWith('/docs/components/') ? 0.6 : 0.8,
      url: `${SITE_URL}${page.href}`,
    })),
  ]
}
