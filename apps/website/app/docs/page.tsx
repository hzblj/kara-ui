import {DocsPage} from '../../src/docs/docs-page'
import {GUIDE_CONTENT} from '../../src/docs/guides'
import {GUIDES} from '../../src/docs/pages'
import {articleLd, JsonLd} from '../../src/seo/json-ld'
import {pageMetadata} from '../../src/seo/metadata'

const page = {...GUIDES.introduction, title: 'Documentation'}
const {Content, headings} = GUIDE_CONTENT.introduction

export const metadata = pageMetadata(page)

export default function DocumentationIndex() {
  return (
    <DocsPage headings={headings} href={page.href}>
      <JsonLd data={articleLd(page, [])} />
      <Content />
    </DocsPage>
  )
}
