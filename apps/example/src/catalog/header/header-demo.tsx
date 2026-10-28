import {Button, Island, Text, VStack} from '@hzblj/kara-ui'
import {router} from 'expo-router'

import {Section} from '../../ui'

export const HeaderDemo = () => (
  <Section caption="Pushes a screen whose header actions come from useHeader.">
    <Island>
      <VStack spacing="s12">
        <Text color="content.secondary">The same actions on both platforms, both sides of the bar.</Text>
        <Button label="Open the screen" onPress={() => router.push('/header')} testID="header-demo-open" />
      </VStack>
    </Island>
  </Section>
)
