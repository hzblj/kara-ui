import {COMPONENT_GROUPS, COMPONENTS} from '../components/registry'
import {GUIDE_CONTENT} from '../guides'
import {componentHref, GUIDES, type GuideId, READING_ORDER} from '../pages'

export type SearchKind = 'component' | 'guide' | 'section'

/** One thing the search can open: a component page, a guide, or a section of one. */
export type SearchEntry = {
  /** Where it belongs: a component's group, or the guide a section is in. */
  context: string
  /** The line under the title. */
  detail: string
  href: string
  kind: SearchKind
  /** Everything else worth matching, as plain text: exports, what each platform renders, the platform notes. */
  keywords: string
  title: string
}

/** The docs' strings carry `code`, **bold** and [links](…); the search reads them as plain text. */
const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '')

const GROUP_TITLES: Record<string, string> = Object.fromEntries(COMPONENT_GROUPS.map(group => [group.id, group.title]))

/** The guides in reading order, so an empty search suggests them the way the sidebar lists them. */
const GUIDE_IDS = (Object.keys(GUIDES) as GuideId[]).sort(
  (a, b) => READING_ORDER.indexOf(GUIDES[a]) - READING_ORDER.indexOf(GUIDES[b])
)

const guideEntries = (id: GuideId): SearchEntry[] => {
  const guide = GUIDES[id]

  return [
    {context: 'Guide', detail: guide.description, href: guide.href, keywords: '', kind: 'guide', title: guide.title},
    // The first heading is the page's own title; the rest are the sections a reader jumps to.
    ...GUIDE_CONTENT[id].headings
      .filter(heading => heading.label !== guide.title)
      .map(
        (heading): SearchEntry => ({
          context: guide.title,
          detail: '',
          href: `${guide.href}#${heading.id}`,
          keywords: '',
          kind: 'section',
          title: heading.label,
        })
      ),
  ]
}

/**
 * Everything the docs' search finds, built at build time from what the site already knows (the registry, the guides
 * and their headings) and handed to the dialog whole: small enough to search on the client, with nothing to fetch.
 */
export const SEARCH_INDEX: SearchEntry[] = [
  ...COMPONENTS.map(
    (component): SearchEntry => ({
      context: GROUP_TITLES[component.group] ?? 'Components',
      detail: component.summary,
      href: componentHref(component.id),
      keywords: plain(
        [...component.exports, component.renders.ios, component.renders.android, ...(component.notes ?? [])].join(' ')
      ),
      kind: 'component',
      title: component.name,
    })
  ),
  ...GUIDE_IDS.flatMap(guideEntries),
]
