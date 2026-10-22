import './styles.css'

import type {Metadata, Viewport} from 'next'
import localFont from 'next/font/local'
import type {ReactNode} from 'react'

import {homeMetadata} from '../src/seo/metadata'
import {HERO_HEADLINE, HERO_LEDE, REPOSITORY_URL, SITE_NAME, SITE_URL} from '../src/site'
import {HEAD_SCRIPT} from '../src/theme/theme'
import {ThemeSync} from '../src/theme/theme-sync'

/**
 * What every page shares. No canonical here: a page states its own, and one inherited from the layout would point
 * every page without one at the home page. The share cards are the home page's until a page sets its own.
 */
export const metadata: Metadata = {
  applicationName: SITE_NAME,
  authors: [{name: 'hzblj', url: 'https://github.com/hzblj'}],
  category: 'technology',
  creator: 'hzblj',
  description: HERO_LEDE,
  icons: {
    apple: {sizes: '180x180', type: 'image/png', url: '/favicon/favicon-180.png'},
    icon: [
      {type: 'image/svg+xml', url: '/favicon/favicon.svg'},
      {sizes: '32x32', type: 'image/png', url: '/favicon/favicon-32.png'},
    ],
  },
  keywords: [
    'Expo',
    'React Native',
    'SwiftUI',
    'Jetpack Compose',
    'design system',
    'UI components',
    'native components',
    'iOS',
    'Android',
    'Material 3',
    'Liquid Glass',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: homeMetadata.openGraph,
  other: {'github:repository': REPOSITORY_URL},
  publisher: 'hzblj',
  robots: {googleBot: {'max-image-preview': 'large', 'max-snippet': -1}},
  title: {default: `${SITE_NAME} — ${HERO_HEADLINE}`, template: `%s · ${SITE_NAME}`},
  twitter: homeMetadata.twitter,
}

export const viewport: Viewport = {
  themeColor: [
    {color: '#fafafa', media: '(prefers-color-scheme: light)'},
    {color: '#0a0a0a', media: '(prefers-color-scheme: dark)'},
  ],
}

const inter = localFont({
  display: 'swap',
  src: [
    {path: '../public/fonts/InterVariable.woff2', style: 'normal', weight: '100 900'},
    {path: '../public/fonts/InterVariable-Italic.woff2', style: 'italic', weight: '100 900'},
  ],
  variable: '--font-kara-inter',
})

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html className={inter.variable} data-platform="ios" lang="en" suppressHydrationWarning>
      <head>
        {/* Inline rather than `next/script`: this has to run before the body is parsed. */}
        <script dangerouslySetInnerHTML={{__html: HEAD_SCRIPT}} />
      </head>
      <body className="font-inter">
        {children}
        <ThemeSync />
      </body>
    </html>
  )
}
