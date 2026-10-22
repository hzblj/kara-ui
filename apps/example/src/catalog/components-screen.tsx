import {router} from 'expo-router'

import {Lead, LinkList, Page, Section} from '../ui'
import {CATALOG, COMPONENT_COUNT} from './catalog'

/**
 * Mirrors `enabled` in `metro.config.js`, which decides whether Storybook is in the bundle — with it switched off,
 * `/storybook` is a stub, so the row goes with it.
 */
const STORYBOOK_LINKED = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED !== 'false'

const PLAYGROUND = [
  {
    icon: 'code' as const,
    id: 'storybook',
    onPress: () => router.push('/storybook'),
    subtitle: 'Every component with live controls',
    title: 'Storybook',
  },
]

export const ComponentsScreen = () => (
  <Page testID="components">
    <Lead>{`${COMPONENT_COUNT} components, each a real SwiftUI or Jetpack Compose view where the platform has one.`}</Lead>
    {CATALOG.map(group => (
      <Section key={group.id} title={group.title}>
        <LinkList
          rows={group.entries.map(entry => ({
            id: `component-${entry.id}`,
            onPress: () => router.push(`/components/${entry.id}`),
            subtitle: entry.summary,
            title: entry.name,
          }))}
        />
      </Section>
    ))}
    {STORYBOOK_LINKED ? (
      <Section title="Playground">
        <LinkList rows={PLAYGROUND} />
      </Section>
    ) : null}
  </Page>
)
