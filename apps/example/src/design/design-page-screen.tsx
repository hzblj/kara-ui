import {useLocalSearchParams} from 'expo-router'

import {Lead, Page} from '../ui'
import {designPage} from './design'

export const DesignPageScreen = () => {
  const {id} = useLocalSearchParams<{id: string}>()
  const page = designPage(id)

  if (!page) {
    return (
      <Page>
        <Lead>This page does not exist.</Lead>
      </Page>
    )
  }

  const {Page: Content} = page

  return (
    <Page testID={`design-${page.id}-page`}>
      <Content />
    </Page>
  )
}
