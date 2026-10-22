import type {MetadataRoute} from 'next'

import {HERO_LEDE, SITE_NAME} from '../src/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#fafafa',
    description: HERO_LEDE,
    display: 'standalone',
    icons: [
      {sizes: 'any', src: '/favicon/favicon.svg', type: 'image/svg+xml'},
      {sizes: '192x192', src: '/favicon/favicon-192.png', type: 'image/png'},
      {sizes: '512x512', src: '/favicon/favicon-512.png', type: 'image/png'},
    ],
    name: SITE_NAME,
    short_name: 'Kara',
    start_url: '/',
    theme_color: '#ff5700',
  }
}
