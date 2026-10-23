import {router} from 'expo-router'

import {Lead, LinkList, Page} from '../ui'
import {DESIGN_PAGES} from './design'

const ROWS = DESIGN_PAGES.map(page => ({
  icon: page.icon,
  id: `design-${page.id}`,
  onPress: () => router.push(`/design/${page.id}`),
  subtitle: page.summary,
  title: page.title,
}))

export const DesignScreen = () => (
  <Page testID="design">
    <Lead>The tokens every component is built from, and the one place to change them for your brand.</Lead>
    <LinkList rows={ROWS} />
  </Page>
)
