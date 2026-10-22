import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ComponentPage} from '../../../src/docs/components/component-page'
import {componentDoc} from '../../../src/docs/components/registry'
import {DocsPage} from '../../../src/docs/docs-page'
import {GUIDE_CONTENT} from '../../../src/docs/guides'
import {ALL_COMPONENT_IDS, componentHref, GUIDES, type GuideId} from '../../../src/docs/pages'
import {articleLd, JsonLd} from '../../../src/seo/json-ld'
import {pageMetadata} from '../../../src/seo/metadata'

type Props = {params: Promise<{slug: string[]}>}

const guideFor = (slug: string[]) => {
  const [first, ...rest] = slug
  return rest.length === 0 && first && first !== 'introduction' && first in GUIDES ? (first as GuideId) : undefined
}

const componentFor = (slug: string[]) =>
  slug[0] === 'components' && slug.length === 2 ? componentDoc(slug[1] ?? '') : undefined

export const dynamicParams = false

export const generateStaticParams = () => [
  ...Object.keys(GUIDES)
    .filter(id => id !== 'introduction')
    .map(id => ({slug: [id]})),
  ...ALL_COMPONENT_IDS.map(id => ({slug: ['components', id]})),
]

/** The page a slug names, as search sees it, and the pages above it in the trail. */
const seoFor = (slug: string[]) => {
  const guide = guideFor(slug)
  const component = componentFor(slug)
  const documentation = {href: GUIDES.introduction.href, title: 'Documentation'}

  if (guide) {
    return {page: GUIDES[guide], trail: [documentation]}
  }

  return component
    ? {
        page: {description: component.summary, href: componentHref(component.id), title: component.name},
        trail: [documentation, {href: GUIDES.components.href, title: GUIDES.components.title}],
      }
    : undefined
}

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
  const seo = seoFor((await params).slug)
  return seo ? pageMetadata(seo.page) : {}
}

export default async function DocumentationPage({params}: Props) {
  const {slug} = await params
  const guide = guideFor(slug)
  const seo = seoFor(slug)
  const ld = seo ? <JsonLd data={articleLd(seo.page, seo.trail)} /> : null

  if (guide) {
    const {Content, headings} = GUIDE_CONTENT[guide]

    return (
      <DocsPage headings={headings} href={GUIDES[guide].href}>
        {ld}
        <Content />
      </DocsPage>
    )
  }

  const component = componentFor(slug)

  if (!component) {
    notFound()
  }

  return (
    <>
      {ld}
      <ComponentPage component={component} />
    </>
  )
}
