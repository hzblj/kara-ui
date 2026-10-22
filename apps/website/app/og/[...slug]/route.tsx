import {readFileSync} from 'node:fs'
import path from 'node:path'
import {ImageResponse} from 'next/og'

import {WEBSITE_ROOT} from '../../../src/docs/source/repo'
import {ogImageHref, SEO_PAGES} from '../../../src/seo/metadata'
import {OgCard} from '../../../src/seo/og-card'

// Every image is drawn once, at build: one per page in SEO_PAGES, nothing on request.
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () => SEO_PAGES.map(page => ({slug: ogImageHref(page.href).split('/').slice(2)}))

/** Inter as static TTF cuts (Satori reads neither WOFF2 nor variable fonts), Latin only. */
const font = (file: string) => readFileSync(path.join(WEBSITE_ROOT, 'src/seo/fonts', file))

export const GET = async (_request: Request, {params}: {params: Promise<{slug: string[]}>}) => {
  const {slug} = await params
  const page = SEO_PAGES.find(entry => ogImageHref(entry.href) === `/og/${slug.join('/')}`)

  if (!page) {
    return new Response('Not found', {status: 404})
  }

  return new ImageResponse(<OgCard page={page} />, {
    fonts: [
      {data: font('Inter-Bold.ttf'), name: 'Inter', style: 'normal', weight: 700},
      {data: font('Inter-Medium.ttf'), name: 'Inter', style: 'normal', weight: 500},
    ],
    height: 630,
    width: 1200,
  })
}
