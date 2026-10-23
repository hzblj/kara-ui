import {Box, RnText, type SpaceSize, spacing} from '@hzblj/kara-ui'

import {CodeBlock, Section} from '../../ui'

const STEPS: SpaceSize[] = ['s4', 's8', 's12', 's16', 's20', 's24', 's32', 's40', 's48', 's64', 's80', 's96']

export const SpacingPage = () => (
  <>
    <Section
      caption="Padding, margins, gaps and stack spacing all come from this one scale. Bars are drawn at twice the size."
      title="Scale"
    >
      <Box bg="surface.primary" borderRadius="large" gap="s10" p="s16">
        {STEPS.map(step => (
          <Box align="center" flexDirection="row" gap="s12" key={step}>
            <Box w={40}>
              <RnText color="content.secondary" variant="footnote">
                {step}
              </RnText>
            </Box>
            <Box bg="fill.accent.primary" borderRadius="small" h={12} w={spacing[step] * 2} />
          </Box>
        ))}
      </Box>
    </Section>
    <Section caption="A raw number does not type-check; only a step of the scale does." title="In use">
      <CodeBlock code={'<VStack p="s16" spacing="s8">\n<Box px="s20" mt="s12" gap="s8">'} />
    </Section>
  </>
)
