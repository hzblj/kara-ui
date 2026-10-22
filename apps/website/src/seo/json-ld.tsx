import {COMPONENTS} from '../docs/components/registry'
import {HERO_LEDE, PACKAGE_NAME, REPOSITORY_URL, SITE_NAME, SITE_URL} from '../site'
import type {SeoPage} from './metadata'

const AUTHOR = {'@type': 'Person', name: 'hzblj', url: 'https://github.com/hzblj'}
const WEBSITE_ID = `${SITE_URL}/#website`
const SOFTWARE_ID = `${SITE_URL}/#software`

/** Structured data in a page's markup; `<` is escaped so nothing in it can close the script early. */
export const JsonLd = ({data}: {data: object}) => (
  <script
    dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    type="application/ld+json"
  />
)

/** The home page: the site, and the library it is about. */
export const homeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {'@id': WEBSITE_ID, '@type': 'WebSite', description: HERO_LEDE, name: SITE_NAME, publisher: AUTHOR, url: SITE_URL},
    {
      '@id': SOFTWARE_ID,
      '@type': 'SoftwareSourceCode',
      author: AUTHOR,
      codeRepository: REPOSITORY_URL,
      description: `${HERO_LEDE} ${COMPONENTS.length} components for iOS and Android.`,
      license: 'https://opensource.org/licenses/MIT',
      name: `${SITE_NAME} (${PACKAGE_NAME})`,
      programmingLanguage: ['TypeScript', 'Swift', 'Kotlin'],
      runtimePlatform: ['Expo', 'React Native', 'iOS', 'Android'],
      url: SITE_URL,
    },
  ],
}

/** A documentation page: an article about the library, and the trail back to the home page. */
export const articleLd = (page: SeoPage, trail: {href: string; title: string}[]) => {
  const url = `${SITE_URL}${page.href}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${url}#article`,
        '@type': 'TechArticle',
        about: {'@id': SOFTWARE_ID},
        author: AUTHOR,
        description: page.description,
        headline: page.title,
        inLanguage: 'en',
        isPartOf: {'@id': WEBSITE_ID},
        publisher: AUTHOR,
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [{href: '/', title: SITE_NAME}, ...trail, page].map((crumb, index) => ({
          '@type': 'ListItem',
          item: `${SITE_URL}${crumb.href}`,
          name: crumb.title,
          position: index + 1,
        })),
      },
    ],
  }
}
