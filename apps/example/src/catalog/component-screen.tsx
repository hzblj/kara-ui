import {Box} from '@hzblj/kara-ui'
import {useLocalSearchParams} from 'expo-router'

import {CodeBlock, Lead, Page, Section, Tags} from '../ui'
import {catalogEntry} from './catalog'
import {isShot} from './shot'

/** One component: what it is, what draws it, live examples, and the snippet to start from. */
export const ComponentScreen = () => {
  const params = useLocalSearchParams<{id: string; shot?: string}>()
  const entry = catalogEntry(params.id)

  if (!entry) {
    return (
      <Page>
        <Lead>This component does not exist.</Lead>
      </Page>
    )
  }

  const {code, Demo, summary, tags} = entry

  if (isShot(params)) {
    return (
      <Page testID={`component-${entry.id}-page`}>
        <Demo />
      </Page>
    )
  }

  return (
    <Page testID={`component-${entry.id}-page`}>
      <Box gap="s12">
        <Lead>{summary}</Lead>
        <Tags tags={tags} />
      </Box>
      <Demo />
      <Section title="Usage">
        <CodeBlock code={code} />
      </Section>
    </Page>
  )
}
