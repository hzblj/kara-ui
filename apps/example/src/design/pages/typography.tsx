import {Box, Island, RnText, Text, type TextVariant, textStyles, VStack} from '@hzblj/kara-ui'

import {Section} from '../../ui'

const VARIANTS = Object.keys(textStyles) as TextVariant[]

const SAMPLE = 'The quick brown fox'

const PAIRS = [
  ['footnote', 'footnoteMedium'],
  ['subheadline', 'subheadlineMedium'],
  ['body', 'headline'],
] as const satisfies readonly (readonly [TextVariant, TextVariant])[]

export const TypographyPage = () => (
  <>
    <Section
      caption="Set in the platform’s own face — SF Pro on iOS, Roboto on Android — unless your theme names one."
      title="Type scale"
    >
      <Box bg="surface.primary" borderRadius="large" gap="s12" p="s16">
        {VARIANTS.map(variant => (
          <Box gap="s2" key={variant}>
            <RnText color="content.tertiary" variant="caption">
              {`${variant} · ${textStyles[variant].fontSize}/${textStyles[variant].lineHeight}`}
            </RnText>
            <RnText numberOfLines={1} variant={variant}>
              {SAMPLE}
            </RnText>
          </Box>
        ))}
      </Box>
    </Section>
    <Section caption="Native text above, React Native text below: the same variants match exactly." title="Both tiers">
      <Box gap="s12">
        {PAIRS.map(pair => (
          <Box bg="surface.primary" borderRadius="large" gap="s4" key={pair.join()} p="s16">
            <Island>
              <VStack align="start" spacing="s2" wide>
                {pair.map(variant => (
                  <Text key={variant} variant={variant}>
                    {SAMPLE}
                  </Text>
                ))}
              </VStack>
            </Island>
            {pair.map(variant => (
              <RnText key={variant} variant={variant}>
                {SAMPLE}
              </RnText>
            ))}
          </Box>
        ))}
      </Box>
    </Section>
  </>
)
