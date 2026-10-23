import {Box, type RadiiSize, RnText} from '@hzblj/kara-ui'

import {CodeBlock, Section} from '../../ui'

const RADII: RadiiSize[] = ['none', 'small', 'medium', 'large', 'full']

export const ShapesPage = () => (
  <>
    <Section title="Radii">
      <Box flexDirection="row" gap="s12" wrap="wrap">
        {RADII.map(radius => (
          <Box align="center" gap="s6" key={radius}>
            <Box bg="fill.accent.primary" borderRadius={radius} h={56} w={56} />
            <RnText color="content.secondary" variant="caption">
              {radius}
            </RnText>
          </Box>
        ))}
      </Box>
    </Section>
    <Section
      caption="Corners can be set together, by side, or one at a time; the more specific one wins."
      title="Per corner"
    >
      <Box gap="s8">
        <Box align="center" bg="fill.tertiary" borderTopRadius="large" h={48} justify="center">
          <RnText variant="footnoteMedium">borderTopRadius</RnText>
        </Box>
        <Box align="center" bg="fill.tertiary" borderBottomRadius="large" h={48} justify="center">
          <RnText variant="footnoteMedium">borderBottomRadius</RnText>
        </Box>
        <Box align="center" bg="fill.tertiary" borderTopLeftRadius="full" h={48} justify="center">
          <RnText variant="footnoteMedium">borderTopLeftRadius full</RnText>
        </Box>
      </Box>
    </Section>
    <Section title="In use">
      <CodeBlock code={'<Card borderRadius="large">\n<Box borderTopRadius="large">'} />
    </Section>
  </>
)
