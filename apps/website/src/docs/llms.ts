import {HERO_LEDE, REPOSITORY_URL, SITE_NAME, SITE_URL} from '../site'
import {COMPONENT_GROUPS, COMPONENTS, componentsIn} from './components/registry'
import {INSTALL_COMMAND} from './guides/getting-started'
import {componentHref, GUIDES} from './pages'
import {readApi} from './source/api'

const HOSTS = {
  native: 'Native: renders inside <Screen> or <Island>.',
  rn: 'React Native tier: renders anywhere.',
  self: 'Brings its own host: renders anywhere.',
}

/** `llms.txt`: what the docs hold, one line per page. */
export const llmsIndex = () =>
  [
    `# ${SITE_NAME}`,
    '',
    `> ${HERO_LEDE}`,
    '',
    'Package: @hzblj/kara-ui (Expo SDK 57, iOS and Android, development build). Router pieces: @hzblj/kara-ui/router.',
    '',
    '## Guides',
    '',
    ...Object.values(GUIDES).map(page => `- [${page.title}](${SITE_URL}${page.href}): ${page.description}`),
    '',
    ...COMPONENT_GROUPS.flatMap(group => [
      `## ${group.title}`,
      '',
      ...componentsIn(group.id).map(
        component => `- [${component.name}](${SITE_URL}${componentHref(component.id)}): ${component.summary}`
      ),
      '',
    ]),
    '## Optional',
    '',
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): every component's import, usage, props and platform notes in one file`,
    `- [Repository](${REPOSITORY_URL}): source, example app, issues`,
    '',
  ].join('\n')

/** `llms-full.txt`: every component in full — import, snippet, props from the types, platform notes. */
export const llmsFull = () => {
  const api = readApi()

  const component = (doc: (typeof COMPONENTS)[number]) => {
    const tables = doc.types.flatMap(name => {
      const type = api.types[name]

      if (!type) {
        return []
      }

      return [
        `### ${name}`,
        '',
        ...(type.extends.length ? [`Also takes: ${type.extends.join(', ')}`, ''] : []),
        ...type.members.map(member => {
          const defaults = member.defaults.ios ?? member.defaults.android
          return `- \`${member.name}${member.optional ? '?' : ''}: ${member.type}\`${defaults ? ` (default \`${defaults}\`)` : ''}${member.description ? ` — ${member.description.replace(/\n+/g, ' ')}` : ''}`
        }),
        '',
      ]
    })

    return [
      `## ${doc.name}`,
      '',
      doc.summary,
      '',
      `iOS: ${doc.renders.ios}. Android: ${doc.renders.android}. ${HOSTS[doc.host]}`,
      '',
      '```tsx',
      `import {${doc.exports.join(', ')}} from '${doc.entry ?? '@hzblj/kara-ui'}'`,
      '',
      doc.code,
      '```',
      '',
      ...tables,
      ...(doc.notes?.length ? ['Notes:', '', ...doc.notes.map(note => `- ${note}`), ''] : []),
    ]
  }

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${HERO_LEDE}`,
    '',
    '## Install',
    '',
    '```bash',
    INSTALL_COMMAND,
    '```',
    '',
    'Add the config plugin — `plugins: [[\'@hzblj/kara-ui\', {icons: {source: \'./assets/icons\'}}]]` — prebuild, and mount `<KaraProvider>` at the root. Native components render inside `<Screen>` or `<Island>`; style through token props (`p="s16"`, `bg="surface.primary"`), never raw values.',
    '',
    ...COMPONENTS.flatMap(component),
  ].join('\n')
}
