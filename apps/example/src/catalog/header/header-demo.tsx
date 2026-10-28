import {Button, Island, Text, VStack} from '@hzblj/kara-ui'
import {router} from 'expo-router'

import {Section} from '../../ui'

export const HeaderDemo = () => (
  <Section caption="Each pushes a screen whose header comes from @hzblj/kara-ui/header.">
    <Island>
      <VStack spacing="s12">
        <Text color="content.secondary">
          Titles, a search field and actions on both sides, the same on React Navigation and Expo Router.
        </Text>
        <Button
          label="Large title, search and actions"
          onPress={() => router.push('/header')}
          testID="header-demo-open"
        />
        <Button
          label="Hero header"
          onPress={() => router.push('/hero')}
          testID="header-demo-hero"
          variant="secondary"
        />
      </VStack>
    </Island>
  </Section>
)
