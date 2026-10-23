import {COMPONENT_GROUPS, COMPONENTS, componentsIn} from './components/registry'

export type DocsHeading = {id: string; label: string}

export type DocsPage = {
  description: string
  href: string
  title: string
}

/** The guides, in reading order — which is also the order the pager walks. */
export const GUIDES = {
  accessibility: {
    description: 'VoiceOver, TalkBack and Reduce Motion: what the components do, and one set of props for the rest.',
    href: '/docs/accessibility',
    title: 'Accessibility and motion',
  },
  changelog: {description: 'What changed in each release of kara.', href: '/docs/changelog', title: 'Changelog'},
  components: {
    description: 'Every component on iOS and Android, in light and dark.',
    href: '/docs/components',
    title: 'Components',
  },
  haptics: {
    description: 'The platform’s own haptic feedback, named for what happened.',
    href: '/docs/haptics',
    title: 'Haptics',
  },
  hosts: {
    description: 'Native views render in a Screen or an Island; the React Native tier renders anywhere.',
    href: '/docs/hosts',
    title: 'Screen and Island',
  },
  icons: {
    description: 'Your own SVGs, turned into native icons on both platforms at prebuild.',
    href: '/docs/icons',
    title: 'Icons',
  },
  installation: {
    description: 'Install kara and its peers, add the config plugin and mount the provider.',
    href: '/docs/installation',
    title: 'Installation',
  },
  introduction: {
    description:
      'A native-first design system for Expo: real SwiftUI and Jetpack Compose views (@expo/ui’s and kara’s own), made one design system by a token-typed sx engine.',
    href: '/docs',
    title: 'Introduction',
  },
  motion: {
    description:
      'Arriving, leaving and changing state: motion presets, animated sx changes and Stagger, reduced with the user.',
    href: '/docs/motion',
    title: 'Motion',
  },
  router: {
    description: 'Native tabs, the navigation theme and the zoom transition, from @hzblj/kara-ui/router.',
    href: '/docs/router',
    title: 'Expo Router',
  },
  styling: {
    description: 'One token-typed sx surface for SwiftUI modifiers, Compose modifiers and React Native styles.',
    href: '/docs/styling',
    title: 'Styling with sx',
  },
  theming: {
    description: 'Colours, typefaces, the Android seed and Material You: overrides of values, never of names.',
    href: '/docs/theming',
    title: 'Theming',
  },
  tokens: {
    description: 'Every colour, spacing, radius and text style kara resolves, read from the library itself.',
    href: '/docs/tokens',
    title: 'Design tokens',
  },
} satisfies Record<string, DocsPage>

export type GuideId = keyof typeof GUIDES

export type NavGroup = {
  label: string
  links: {href: string; title: string}[]
  /** Nested under the group's own links — the component categories. */
  subgroups?: {label: string; links: {href: string; title: string}[]}[]
}

const link = (id: GuideId) => ({href: GUIDES[id].href, title: GUIDES[id].title})

export const componentHref = (id: string) => `/docs/components/${id}`

export const NAV: NavGroup[] = [
  {label: 'Getting started', links: [link('introduction'), link('installation')]},
  {
    label: 'Core concepts',
    links: [
      link('hosts'),
      link('styling'),
      link('motion'),
      link('theming'),
      link('tokens'),
      link('icons'),
      link('haptics'),
      link('accessibility'),
      link('router'),
    ],
  },
  {
    label: 'Components',
    links: [{href: GUIDES.components.href, title: 'All components'}],
    subgroups: COMPONENT_GROUPS.map(group => ({
      label: group.title,
      links: componentsIn(group.id).map(component => ({href: componentHref(component.id), title: component.name})),
    })),
  },
  {label: 'Reference', links: [link('changelog')]},
]

/** Every page in the order a reader steps through them with the pager. */
export const READING_ORDER: DocsPage[] = [
  GUIDES.introduction,
  GUIDES.installation,
  GUIDES.hosts,
  GUIDES.styling,
  GUIDES.motion,
  GUIDES.theming,
  GUIDES.tokens,
  GUIDES.icons,
  GUIDES.haptics,
  GUIDES.accessibility,
  GUIDES.router,
  GUIDES.components,
  ...COMPONENT_GROUPS.flatMap(group =>
    componentsIn(group.id).map(component => ({
      description: component.summary,
      href: componentHref(component.id),
      title: component.name,
    }))
  ),
  GUIDES.changelog,
]

export const neighbours = (href: string) => {
  const index = READING_ORDER.findIndex(page => page.href === href)

  return {next: READING_ORDER[index + 1], previous: index > 0 ? READING_ORDER[index - 1] : undefined}
}

export const ALL_COMPONENT_IDS = COMPONENTS.map(component => component.id)
