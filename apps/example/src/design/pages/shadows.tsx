import {Box, Island, RnText, shadowNames, Text, VStack} from '@hzblj/kara-ui'

import {CodeBlock, Section} from '../../ui'

export const ShadowsPage = () => (
  <>
    <Section caption="The same token on a native view and on a React Native one." title="Tokens">
      <Box gap="s16">
        {shadowNames.map(name => (
          <Box gap="s8" key={name}>
            <Island>
              <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" shadow={name} wide>
                <Text variant="subheadline">{name}</Text>
              </VStack>
            </Island>
            <Box bg="surface.primary" borderRadius="large" p="s16" shadow={name}>
              <RnText variant="subheadline">{name}</RnText>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
    <Section title="In use">
      <CodeBlock code={'<VStack shadow="card">\n<Box shadow="snackbar">'} />
    </Section>
  </>
)
