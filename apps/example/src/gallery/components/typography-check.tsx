import {Box, Island, RnText, Text, type TextVariant, VStack} from '@hzblj/kara-ui'

const SAMPLE = 'Příšerně žluťoučký kůň 0123'

const WEIGHT_PAIRS = [
  {medium: 'captionMedium', regular: 'caption'},
  {medium: 'labelMedium', regular: 'label'},
  {medium: 'footnoteMedium', regular: 'footnote'},
  {medium: 'subheadlineMedium', regular: 'subheadline'},
] as const satisfies readonly {medium: TextVariant; regular: TextVariant}[]

/**
 * The same variants in both tiers, one above the other: SwiftUI/Compose text in an island, React Native text below it.
 * They resolve the same theme typography, so a mismatch in size, weight or face here is a bug in one of the tiers —
 * and with a custom `fonts` theme, the place to see that every weight found its face.
 */
export const TypographyCheck = () => (
  <Box gap="s16">
    {WEIGHT_PAIRS.map(pair => (
      <Box gap="s4" key={pair.regular}>
        <RnText color="content.tertiary" variant="caption">
          {pair.regular} vs {pair.medium} · native, then React Native
        </RnText>
        <Island>
          <VStack align="start" spacing="s2" wide>
            <Text variant={pair.regular}>{SAMPLE}</Text>
            <Text variant={pair.medium}>{SAMPLE}</Text>
          </VStack>
        </Island>
        <RnText variant={pair.regular}>{SAMPLE}</RnText>
        <RnText variant={pair.medium}>{SAMPLE}</RnText>
      </Box>
    ))}
  </Box>
)
