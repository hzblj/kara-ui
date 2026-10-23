import {Box, Island, RnText, Text, VStack} from '@hzblj/kara-ui'

import {CodeBlock, Section} from '../../ui'

export const StylingPage = () => (
  <>
    <Section
      caption="Native views and React Native views take the same props, resolved from the same tokens."
      title="One sx for both"
    >
      <Island>
        <VStack align="start" bg="fill.accent.base" borderRadius="large" p="s16" wide>
          <Text color="content.accent">Native VStack</Text>
        </VStack>
      </Island>
      <Box bg="fill.accent.base" borderRadius="large" p="s16">
        <RnText color="content.accent">React Native Box</RnText>
      </Box>
      <CodeBlock
        code={
          '<VStack bg="fill.accent.base" borderRadius="large" p="s16">\n<Box bg="fill.accent.base" borderRadius="large" p="s16">'
        }
      />
    </Section>
    <Section title="Borders">
      <Box gap="s12">
        <Box borderBottomWidth={1} borderColor="border.tertiary" pb="s8">
          <RnText variant="subheadline">A divider on one side</RnText>
        </Box>
        <Box borderColor="content.accent" borderLeftWidth={3} pl="s12">
          <RnText variant="subheadline">A quote rule</RnText>
        </Box>
        <Box borderColor="border.tertiary" borderRadius="medium" borderStyle="dashed" borderWidth={1} p="s12">
          <RnText variant="subheadline">Dashed</RnText>
        </Box>
      </Box>
    </Section>
    <Section title="Sizes">
      <Box gap="s8">
        <Box bg="fill.tertiary" borderRadius="small" p="s8" w="50%">
          <RnText variant="footnote">w="50%"</RnText>
        </Box>
        <Box align="center" aspectRatio={3} bg="fill.success.primary" borderRadius="small" justify="center">
          <RnText color="content.on.accent" variant="footnoteMedium">
            aspectRatio={3}
          </RnText>
        </Box>
        <Box bg="fill.tertiary" borderRadius="small" maxW={200} minH={56} p="s8">
          <RnText variant="footnote">
            minH={56} maxW={200}
          </RnText>
        </Box>
      </Box>
    </Section>
    <Section
      caption="The everyday layouts have a word of their own, and each gives way to the key it stands for."
      title="Shorthands"
    >
      <Box gap="s8">
        <Box gap="s8" row wrap>
          {['row', 'wrap', 'gap="s8"'].map(label => (
            <Box bg="fill.tertiary" borderRadius="full" key={label} px="s12" py="s6">
              <RnText variant="footnote">{label}</RnText>
            </Box>
          ))}
        </Box>
        <Box bg="fill.quaternary" borderRadius="medium" h={96} overflow="hidden">
          <Box absolute bg="fill.accent.base" m="s12" />
          <Box center fill>
            <Box bg="fill.accent.primary" borderRadius="full" center size={40}>
              <RnText color="content.on.accent" variant="footnoteMedium">
                40
              </RnText>
            </Box>
          </Box>
        </Box>
      </Box>
      <CodeBlock code={'<Box row wrap gap="s8" />\n<Box absolute />\n<Box center fill />\n<Box center size={40} />'} />
    </Section>
    <Section caption="Layout props take a value per breakpoint, too." title="Responsive">
      <CodeBlock code={"<Box p={{base: 's16', md: 's32'}} />"} />
    </Section>
  </>
)
